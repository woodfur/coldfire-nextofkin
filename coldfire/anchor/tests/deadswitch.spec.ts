import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DeadMansSwitch } from "../target/types/dead_mans_switch";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { describe, expect, it, beforeAll, beforeEach } from '@jest/globals';

describe("dead_mans_switch", () => {
  
  


  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.DeadMansSwitch as Program<DeadMansSwitch>;

  const owner = (program.provider as anchor.AnchorProvider).wallet;
  const beneficiary = Keypair.generate();
  let switchAccount = Keypair.generate();
  const switchDelay = 5;

  // create and fund unauthorized wallet address
  
  beforeAll(async () => {
    // Airdrop SOL to owner and beneficiary
    const airdropOwner = await provider.connection.requestAirdrop(owner.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(airdropOwner);

    const airdropBeneficiary = await provider.connection.requestAirdrop(beneficiary.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(airdropBeneficiary);
  });

  beforeEach(async () => {
    switchAccount = Keypair.generate();
    await program.methods.initialize(new anchor.BN(switchDelay)).accounts({
      switch: switchAccount.publicKey,
      owner: owner.publicKey,
      beneficiary: beneficiary.publicKey,
      systemProgram: SystemProgram.programId,
    }).signers([switchAccount]).rpc();
  });


  // beforeAll(async () => {
  //   // Fund the unauthorized user account
  //   const airdropWithRetry = async (retries = 5) => {
  //     for (let i = 0; i < retries; i++) {
  //       try {
  //         const signature = await provider.connection.requestAirdrop(
  //           unauthorizedUser.publicKey,
  //           1000000000 // 1 SOL
  //         );
  //         await provider.connection.confirmTransaction(signature, 'confirmed');
  //         console.log("Successfully funded unauthorized user");
  //         return;
  //       } catch (error) {
  //         console.error(`Airdrop attempt ${i + 1} failed:`, error);
  //         if (i === retries - 1) throw error;
  //         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
  //       }
  //     }
  //   };

  //   await airdropWithRetry();
  // });



  it("Initializes the switch", async () => {
    await program.methods.initialize(new anchor.BN(switchDelay)).accounts({
      switch: switchAccount.publicKey,
      owner: owner.publicKey,
      beneficiary: beneficiary.publicKey,
    }).signers([switchAccount]).rpc();

    const switchState = await program.account.deadMansSwitch.fetch(switchAccount.publicKey);

    expect(switchState.owner.toBase58()).toBe(owner.publicKey.toBase58());
    expect(switchState.beneficiary.toBase58()).toBe(beneficiary.publicKey.toBase58());
    expect(switchState.switchDelay.toNumber()).toBe(switchDelay);
    expect(switchState.lastCheckIn.toNumber()).toBeGreaterThan(0); 
  });

  it("Fails to initialize with invalid delay", async () => {
    const invalidSwitchAccount = Keypair.generate();
    await expect(
      program.methods.initialize(new anchor.BN(0)).accounts({
        switch: invalidSwitchAccount.publicKey,
        owner: owner.publicKey,
        beneficiary: beneficiary.publicKey,
      }).signers([invalidSwitchAccount]).rpc()
    ).rejects.toThrow(/Switch delay must be greater than zero/);
  });

  it("Allows owner to check in", async () => {
    const initialState = await program.account.deadMansSwitch.fetch(switchAccount.publicKey);
    
    // Wait for a short time to ensure the lastCheckIn will be different
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    await program.methods.checkIn().accounts({
      switch: switchAccount.publicKey,

    }).rpc();
  
    const updatedState = await program.account.deadMansSwitch.fetch(switchAccount.publicKey);
    expect(updatedState.lastCheckIn.toNumber()).toBeGreaterThan(initialState.lastCheckIn.toNumber());
  });

  // it("Prevents non-owner from checking in", async () => {
  //   await expect(
  //     program.methods
  //       .checkIn()
  //       .accounts({
  //         switch: switchAccount.publicKey,
  //       })
  //       .signers([unauthorizedUser])
  //       .rpc()
  //   ).rejects.toThrow();
  // });

  it("Prevents early switch execution", async () => {

    console.log("Switch Account:", switchAccount.publicKey.toBase58());
    console.log("Owner:", owner.publicKey.toBase58());
    console.log("Beneficiary:", beneficiary.publicKey.toBase58());

  await expect(
    program.methods
      .executeSwitch()
      .accounts({
        switch: switchAccount.publicKey,
        beneficiary: beneficiary.publicKey,
        owner: owner.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([beneficiary])
      .rpc()
  ).rejects.toThrow(/Not enough time has passed to execute the switch/);
});

it("Allows switch execution after delay", async () => {
  // First, we need to wait for the switch delay to pass
  await new Promise(resolve => setTimeout(resolve, (switchDelay + 1) * 1000));

  const ownerInitialBalance = await provider.connection.getBalance(owner.publicKey);
  const beneficiaryInitialBalance = await provider.connection.getBalance(beneficiary.publicKey);

  await program.methods
    .executeSwitch()
    .accounts({
      switch: switchAccount.publicKey,
      beneficiary: beneficiary.publicKey,
      owner: owner.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([beneficiary])
    .rpc();

  const ownerFinalBalance = await provider.connection.getBalance(owner.publicKey);
  const beneficiaryFinalBalance = await provider.connection.getBalance(beneficiary.publicKey);

  expect(ownerFinalBalance).toBeLessThan(ownerInitialBalance);
  expect(beneficiaryFinalBalance).toBeGreaterThan(beneficiaryInitialBalance);

  // Verify that the switch account has been closed
  await expect(
    program.account.deadMansSwitch.fetch(switchAccount.publicKey)
  ).rejects.toThrow();
},(switchDelay + 10) * 1000);

it("Prevents unauthorized switch execution", async () => {
  const unauthorizedUser = Keypair.generate();

  const signature = await provider.connection.requestAirdrop(
    unauthorizedUser.publicKey,
    1000000000 // 1 SOL
  );
  await provider.connection.confirmTransaction(signature);

  await expect(
    program.methods
      .executeSwitch()
      .accounts({
        switch: switchAccount.publicKey,
        beneficiary: unauthorizedUser.publicKey,
        owner: owner.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([unauthorizedUser])
      .rpc()
  ).rejects.toThrow();
});

it("Allows multiple check-ins", async () => {
  const initialState = await program.account.deadMansSwitch.fetch(switchAccount.publicKey);
  
  // First check-in
  await program.methods.checkIn().accounts({
    switch: switchAccount.publicKey,
  }).rpc();

  const midState = await program.account.deadMansSwitch.fetch(switchAccount.publicKey);
  expect(midState.lastCheckIn.toNumber()).toBeGreaterThan(initialState.lastCheckIn.toNumber());

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Second check-in
  await program.methods.checkIn().accounts({
    switch: switchAccount.publicKey,
  }).rpc();

  const finalState = await program.account.deadMansSwitch.fetch(switchAccount.publicKey);
  expect(finalState.lastCheckIn.toNumber()).toBeGreaterThan(midState.lastCheckIn.toNumber());
});


it("Prevents switch execution immediately after check-in", async () => {
  // Check-in
  await program.methods.checkIn().accounts({
    switch: switchAccount.publicKey,
  }).rpc();

  // Attempt to execute switch immediately
  await expect(
    program.methods
      .executeSwitch()
      .accounts({
        switch: switchAccount.publicKey,
        beneficiary: beneficiary.publicKey,
        owner: owner.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([beneficiary])
      .rpc()
  ).rejects.toThrow();
});


})