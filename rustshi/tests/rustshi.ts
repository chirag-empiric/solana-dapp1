import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Rustshi } from "../target/types/rustshi";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "bn.js";

describe("rustshi", () => {

  let mainKeypair = Keypair.fromSecretKey(Uint8Array.from([129, 66, 188, 237, 45, 153, 77, 40, 148, 67, 90, 123, 31, 246, 178, 113, 131, 162, 186, 180, 212, 186, 105, 143, 10, 56, 188, 63, 211, 56, 161, 38, 74, 45, 234, 236, 131, 169, 174, 25, 123, 33, 209, 201, 63, 95, 93, 40, 231, 90, 225, 62, 157, 204, 122, 52, 93, 138, 199, 40, 34, 136, 104, 129]));
  const mainWallet = new anchor.Wallet(mainKeypair);

  // const connection = new Connection("https://api.devnet.solana.com", {
  //   commitment: 'confirmed'
  // });


  const connection = new Connection("http://localhost:8899", {
    commitment: 'confirmed'
  });

  const provider = new anchor.AnchorProvider(connection, mainWallet, {
    commitment: "confirmed"
  });

  anchor.setProvider(provider);

  const program = anchor.workspace.Rustshi as Program<Rustshi>;

  const [hits] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("helo")],
    program.programId
  );

  it("is doing sol thing", async () => {

    let newKeypair2 = anchor.web3.Keypair.generate();
    let newW = new anchor.Wallet(newKeypair2);
    await connection.confirmTransaction(await connection.requestAirdrop(newKeypair2.publicKey, 100 * LAMPORTS_PER_SOL), "confirmed");

    console.log("Balance before TX: ", await connection.getBalance(newKeypair2.publicKey));

    let tx = await program.methods
      .participate(new BN(2 * LAMPORTS_PER_SOL))
      .accounts({
        hits: hits,
        signer: newKeypair2.publicKey
      })
      .signers([newW.payer])
      .rpc();

    console.log("User Registration Successful: ", tx);

    console.log("Balance After TX: ", await connection.getBalance(newKeypair2.publicKey));
    let data = await program.account.hits.fetch(hits);
    console.log("Data found: ", data);
  });
});
