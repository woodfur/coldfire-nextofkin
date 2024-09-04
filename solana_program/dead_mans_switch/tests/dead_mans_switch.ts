import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { expect } from "chai";
import { describe, it } from "mocha";
import { Idl } from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";

// Add this type definition at the top of the file
type DeadMansSwitchAccount = {
  owner: web3.PublicKey;
  beneficiary: web3.PublicKey;
  switchDelay: anchor.BN;
  lastCheckIn: anchor.BN;
};

export interface DeadMansSwitch extends Idl {
  version: string;
  name: string;
  instructions: any[];
  accounts: any[];
  types: any[];
}

describe("dead_mans_switch", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DeadMansSwitch as Program<DeadMansSwitch>;

  const switchAccount = anchor.web3.Keypair.generate();
  const owner = provider.wallet;
  const beneficiary = anchor.web3.Keypair.generate();
  const switchDelay = new anchor.BN(86400); // 24 hours in seconds

  it("Initializes the switch", async () => {
    await program.methods
      .initialize(switchDelay)
      .accounts({
        switch: switchAccount.publicKey,
        owner: owner.publicKey,
        beneficiary: beneficiary.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([switchAccount])
      .rpc();

    // Update the fetch call
    const account = await program.account.deadMansSwitch.fetch(switchAccount.publicKey) as DeadMansSwitchAccount;
    expect(account.owner.toString()).to.equal(owner.publicKey.toString());
    expect(account.beneficiary.toString()).to.equal(beneficiary.publicKey.toString());
    expect(account.switchDelay.toNumber()).to.equal(switchDelay.toNumber());
    expect(account.lastCheckIn.toNumber()).to.be.greaterThan(0);
  });

  it("Fails to initialize with invalid delay", async () => {
    const invalidSwitchAccount = anchor.web3.Keypair.generate();
    try {
      await program.methods
        .initialize(new anchor.BN(0))
        .accounts({
          switch: invalidSwitchAccount.publicKey,
          owner: owner.publicKey,
          beneficiary: beneficiary.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([invalidSwitchAccount])
        .rpc();
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect((error as { error: { errorMessage: string } }).error.errorMessage).to.equal("Switch delay must be greater than zero");
    }
  });

  it("Allows owner to check in", async () => {
    await program.methods
      .checkIn()
      .accounts({
        switch: switchAccount.publicKey,
        owner: owner.publicKey,
      })
      .rpc();

    const account = await program.account.deadMansSwitch.fetch(switchAccount.publicKey) as DeadMansSwitchAccount;
    expect(account.lastCheckIn.toNumber()).to.be.greaterThan(0);
  });

  it("Prevents non-owner from checking in", async () => {
    try {
      await program.methods
        .checkIn()
        .accounts({
          switch: switchAccount.publicKey,
          owner: beneficiary.publicKey,
        })
        .signers([beneficiary])
        .rpc();
      expect.fail("Should have thrown an error");
    } catch (error: unknown) {
      if (error instanceof Error && 'error' in error && typeof error.error === 'object' && error.error !== null && 'errorMessage' in error.error) {
        expect((error.error as { errorMessage: string }).errorMessage).to.equal("Only the owner can check in");
      } else {
        throw error; // Re-throw if it's not the expected error type
      }
    }
  });

  it("Prevents early switch execution", async () => {
    try {
      await program.methods
        .executeSwitch()
        .accounts({
          switch: switchAccount.publicKey,
          beneficiary: beneficiary.publicKey,
        })
        .signers([beneficiary])
        .rpc();
      expect.fail("Should have thrown an error");
    } catch (error: unknown) {
      if (error instanceof Error && 'error' in error && typeof error.error === 'object' && error.error !== null && 'errorMessage' in error.error) {
        expect((error.error as { errorMessage: string }).errorMessage).to.equal("Not enough time has passed to execute the switch");
      } else {
        throw error; // Re-throw if it's not the expected error type
      }
    }
  });

  it("Allows switch execution after delay", async () => {
    // Manually advance blockchain time
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(owner.publicKey, 10000000000),
      "confirmed"
    );
    await new Promise(resolve => setTimeout(resolve, switchDelay.toNumber() * 1000));

    await program.methods
      .executeSwitch()
      .accounts({
        switch: switchAccount.publicKey,
        beneficiary: beneficiary.publicKey,
      })
      .signers([beneficiary])
      .rpc();

    // Verify that the account has been closed
    const accountInfo = await provider.connection.getAccountInfo(switchAccount.publicKey);
    expect(accountInfo).to.be.null;
  });

  // Advance clock
  it("Advances clock", async () => {
    await program.methods.advanceClock(new anchor.BN(switchDelay.toNumber())).rpc();
  });
});