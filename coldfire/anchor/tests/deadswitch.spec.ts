import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DeadMansSwitch } from "../target/types/dead_mans_switch";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { describe, expect, it, beforeAll, beforeEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe("dead_mans_switch", () => {
  
  let switchAccount: Keypair;
  try {
    const switchAccountPath = path.resolve(__dirname, 'switchAccount.json');
    switchAccount = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync(switchAccountPath, 'utf8')))
    );
  } catch (error) {
    console.error("Error reading switchAccount.json:", error);
    throw new Error("Please ensure switchAccount.json exists and is correctly formatted.");
  }

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.DeadMansSwitch as Program<DeadMansSwitch>;

  const owner = (program.provider as anchor.AnchorProvider).wallet;
  const beneficiary = Keypair.generate();
  //const switchAccount = Keypair.generate();
  const switchDelay = 5;

  // create and fund unauthorized wallet address


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





// it("Allows multiple check-ins", async () => {
//   console.log("Switch Account pubkey:", switchAccount.publicKey.toBase58());

//   try {
//     // Ensure the switch account has enough balance
//     const balance = await provider.connection.getBalance(switchAccount.publicKey);
//     console.log(`Switch account balance: ${balance / LAMPORTS_PER_SOL} SOL`);

//     if (balance < LAMPORTS_PER_SOL) {
//       throw new Error("Switch account does not have enough SOL");
//     }

//     // Initialize the switch if not already initialized
//     try {
//       const switchState = await program.account.deadMansSwitch.fetch(switchAccount.publicKey);
//       console.log("Switch is already initialized.");
//     } catch (error) {
//       console.log("Initializing the switch...");
//       await program.methods.initialize(new anchor.BN(switchDelay)).accounts({
//         switch: switchAccount.publicKey,
//         owner: owner.publicKey,
//         beneficiary: beneficiary.publicKey,
//         systemProgram: SystemProgram.programId,
//       }).signers([switchAccount]).rpc();
//       console.log("Switch initialized successfully.");
//     }

//     // Fetch initial state
//     const initialState = await program.account.deadMansSwitch.fetch(switchAccount.publicKey);
//     console.log("Initial last check-in time:", initialState.lastCheckIn.toString());

//     // First check-in
//     console.log("Performing first check-in...");
//     await program.methods
//       .checkIn()
//       .accounts({
//         switch: switchAccount.publicKey,
//       })
//       .rpc();
//     console.log("First check-in completed");

//     // Fetch state after first check-in
//     const midState = await program.account.deadMansSwitch.fetch(switchAccount.publicKey);
//     console.log("Mid last check-in time:", midState.lastCheckIn.toString());
//     expect(midState.lastCheckIn.toNumber()).toBeGreaterThan(initialState.lastCheckIn.toNumber());

//     // Wait for a short period
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     // Second check-in
//     console.log("Performing second check-in...");
//     await program.methods
//       .checkIn()
//       .accounts({
//         switch: switchAccount.publicKey,
//       })
//       .rpc();
//     console.log("Second check-in completed");

//     // Fetch final state
//     const finalState = await program.account.deadMansSwitch.fetch(switchAccount.publicKey);
//     console.log("Final last check-in time:", finalState.lastCheckIn.toString());
//     expect(finalState.lastCheckIn.toNumber()).toBeGreaterThan(midState.lastCheckIn.toNumber());

//   } catch (error) {
//     console.error("Error in multiple check-ins test:", error);
//     throw error;
//   }
// });


// it("Prevents non-owner from checking in", async () => {
//   const unauthorizedUser = Keypair.generate();

//   const signature = await provider.connection.requestAirdrop(
//     unauthorizedUser.publicKey,
//     1000000000 // 1 SOL
//   );
//   await provider.connection.confirmTransaction(signature);

//   await expect(
//     program.methods
//       .checkIn()
//       .accounts({
//         switch: switchAccouncleat.publicKey,
//         owner: unauthorizedUser.publicKey,
//       })
//       .signers([unauthorizedUser])
//       .rpc()
//   ).rejects.toThrow(/Only the owner can check in/);
// });

// it("Prevents non-beneficiary from executing the switch", async () => {
//   const unauthorizedUser = Keypair.generate();

//   const signature = await provider.connection.requestAirdrop(
//     unauthorizedUser.publicKey,
//     1000000000 // 1 SOL
//   );
//   await provider.connection.confirmTransaction(signature);

//   await expect(
//     program.methods
//       .executeSwitch()
//       .accounts({
//         switch: switchAccount.publicKey,
//         beneficiary: unauthorizedUser.publicKey,
//         owner: owner.publicKey,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([unauthorizedUser])
//       .rpc()
//   ).rejects.toThrow(/Only the beneficiary can execute the switch/);
// });


})