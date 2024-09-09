import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DeadMansSwitch } from "../target/types/dead_mans_switch";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { describe, expect, it } from '@jest/globals';

describe("dead_mans_switch", () => {
  
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.DeadMansSwitch as Program<DeadMansSwitch>;

  const owner = (program.provider as anchor.AnchorProvider).wallet;
  const beneficiary = Keypair.generate();
  const switchAccount = Keypair.generate();
  const switchDelay = 100;

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



})