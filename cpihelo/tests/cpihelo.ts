import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Helo } from "../target/types/helo";
import { Connection, Keypair, SystemProgram } from "@solana/web3.js";
import { World } from "../target/types/world";

describe("Testing Hello", () => {
  let mainKeypair = Keypair.fromSecretKey(Uint8Array.from([129, 66, 188, 237, 45, 153, 77, 40, 148, 67, 90, 123, 31, 246, 178, 113, 131, 162, 186, 180, 212, 186, 105, 143, 10, 56, 188, 63, 211, 56, 161, 38, 74, 45, 234, 236, 131, 169, 174, 25, 123, 33, 209, 201, 63, 95, 93, 40, 231, 90, 225, 62, 157, 204, 122, 52, 93, 138, 199, 40, 34, 136, 104, 129]));

  const mainWallet = new anchor.Wallet(mainKeypair);

  const connection = new Connection("http://localhost:8899", {
    commitment: 'confirmed'
  });

  const provider = new anchor.AnchorProvider(connection, mainWallet, {
    commitment: "confirmed"
  });

  anchor.setProvider(provider);

  const program = anchor.workspace.Helo as Program<Helo>;
  const worldprogram = anchor.workspace.World as Program<World>;

  const worldKeyPair = Keypair.generate();

  const [acc] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("helo")],
    program.programId
  );


  it("Is initialized!", async () => {
    // initializing the account
    const init_tx = await program.methods.initialize().accounts({
      data: acc,
      signer: mainKeypair.publicKey,
      systemProgram: SystemProgram.programId
    }).signers([mainKeypair]).rpc();

    // storing the data
    const tx = await program.methods.storeName().accounts({
      data: acc,
    }).signers([mainKeypair]).rpc();

    const update_name = await worldprogram.methods.updateNameShit().accounts({
      dataFromHelo: acc,
      heloProgram: program.programId
    }).signers([mainKeypair]).rpc();

    let da = await program.account.data.fetch(acc);
    console.log(da);
  });
});
