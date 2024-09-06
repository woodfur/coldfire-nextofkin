import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { describe, it } from "mocha";
import { Idl } from "@coral-xyz/anchor";
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
});