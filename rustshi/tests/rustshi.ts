import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Rustshi } from "../target/types/rustshi";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";

describe("rustshi", () => {

  let mainKeypair = Keypair.fromSecretKey(Uint8Array.from([129, 66, 188, 237, 45, 153, 77, 40, 148, 67, 90, 123, 31, 246, 178, 113, 131, 162, 186, 180, 212, 186, 105, 143, 10, 56, 188, 63, 211, 56, 161, 38, 74, 45, 234, 236, 131, 169, 174, 25, 123, 33, 209, 201, 63, 95, 93, 40, 231, 90, 225, 62, 157, 204, 122, 52, 93, 138, 199, 40, 34, 136, 104, 129]));
  const mainWallet = new anchor.Wallet(mainKeypair);

  const connection = new Connection("https://api.devnet.solana.com", {
    commitment: 'confirmed'
  });

  const provider = new anchor.AnchorProvider(connection, mainWallet, {
    commitment: "confirmed"
  });

  anchor.setProvider(provider);

  const program = anchor.workspace.Rustshi as Program<Rustshi>;
  it("is Registering the 1st User", async () => {
    const [hits] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("helo")],
      program.programId
    );

    const tx = await program.methods
      .participate()
      .accounts({
        hits: hits,
        signer: mainKeypair.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([mainKeypair])
      .rpc();
    console.log("User Registration Successful: ", tx);

    let data = await program.account.hits.fetch(hits);
    console.log(data);
  });

  return;

  it("is Registering the 2nd User", async () => {

    let newKeypair2 = anchor.web3.Keypair.generate();

    await connection.requestAirdrop(newKeypair2.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(await connection.requestAirdrop(newKeypair2.publicKey, LAMPORTS_PER_SOL), "confirmed");

    const [hits] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("helo")],
      program.programId
    );

    const tx = await program.methods
      .participate()
      .accounts({
        hits: hits,
        signer: newKeypair2.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([newKeypair2])
      .rpc();
    console.log("User Registration Successful: ", tx);

    let data = await program.account.hits.fetch(hits);
    console.log(data);
  });
});
