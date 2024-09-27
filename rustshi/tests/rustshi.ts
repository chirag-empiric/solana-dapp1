import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Rustshi } from "../target/types/rustshi";
import { Tokenthing } from "../target/types/tokenthing";
import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { BN } from "bn.js";

describe("rustshi", () => {
  let mainKeypair = Keypair.fromSecretKey(
    Uint8Array.from([129, 66, 188, 237, 45, 153, 77, 40, 148, 67, 90, 123, 31, 246, 178, 113, 131, 162, 186, 180, 212, 186, 105, 143, 10, 56, 188, 63, 211, 56, 161, 38, 74, 45, 234, 236, 131, 169, 174, 25, 123, 33, 209, 201, 63, 95, 93, 40, 231, 90, 225, 62, 157, 204, 122, 52, 93, 138, 199, 40, 34, 136, 104, 129])
  );
  const mainWallet = new anchor.Wallet(mainKeypair);

  const connection = new Connection("http://localhost:8899", {
    commitment: "confirmed",
  });

  const provider = new anchor.AnchorProvider(connection, mainWallet, {
    commitment: "confirmed",
  });

  anchor.setProvider(provider);

  const program = anchor.workspace.Rustshi as Program<Rustshi>;
  const tokenthingProgram = anchor.workspace.Tokenthing as Program<Tokenthing>;

  const [globalSeed] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("jua")],
    program.programId
  );
  const [finalSeed] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("juari")],
    program.programId
  );
  const [rewardPoolSeed] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("khatu")],
    program.programId
  );

  it("is doing partbet thing via original", async () => {
    // ignore -- new wallet generation shit
    let newKeypair2 = anchor.web3.Keypair.generate();
    await connection.confirmTransaction(
      await connection.requestAirdrop(
        newKeypair2.publicKey,
        9 * LAMPORTS_PER_SOL
      ),
      "confirmed"
    );

    let tx = await program.methods
      .partBet(new BN(4), { modiji: [true] })
      .accounts({
        globalState: globalSeed,
        rewardPool: rewardPoolSeed,
        signer: newKeypair2.publicKey,
      })
      .signers([newKeypair2])
      .rpc();

    console.log("User Registration Successful: ", tx);

    let globalState = await program.account.globalState.fetch(globalSeed);
    console.log("Global State is: ", globalState);
  });

  it("is doing partbet thing again", async () => {
    // ignore -- new wallet generation shit
    let newKeypair2 = anchor.web3.Keypair.generate();
    await connection.confirmTransaction(
      await connection.requestAirdrop(
        newKeypair2.publicKey,
        9 * LAMPORTS_PER_SOL
      ),
      "confirmed"
    );

    let tx = await program.methods
      .partBet(new BN(4), { obama: [true] })
      .accounts({
        globalState: globalSeed,
        rewardPool: rewardPoolSeed,
        signer: newKeypair2.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([newKeypair2])
      .rpc();

    console.log("User Registration Successful: ", tx);

    let globalState = await program.account.globalState.fetch(globalSeed);
    console.log("Global State is: ", globalState);
  });

  it("is getting winner shit", async () => {
    // ignore -- new wallet generation shit
    let newKp = anchor.web3.Keypair.generate();
    await connection.confirmTransaction(
      await connection.requestAirdrop(newKp.publicKey, 100 * LAMPORTS_PER_SOL),
      "confirmed"
    );
    await program.methods
      .declareResult({ modiji: [true] })
      .accounts({
        finalState: finalSeed,
        globalState: globalSeed,
        signer: newKp.publicKey,
      })
      .signers([newKp])
      .rpc();

    let finalState = await program.account.finalState.fetch(finalSeed);
    console.log("Final State is: ", finalState);
  });
});