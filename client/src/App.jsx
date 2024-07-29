import { useEffect, useState } from "react";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import idl from "./IDL/idl.json";
import { AnchorProvider, Program } from "@project-serum/anchor";

const rpcUrl = clusterApiUrl("devnet");
const rpcConnection = new Connection(rpcUrl, {
  commitment: "confirmed",
});

function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  const programId = new PublicKey(idl.metadata.address);
  const encoder = new TextEncoder();
  const seed = encoder.encode("helo");
  const [hits] = PublicKey.findProgramAddressSync([seed], programId);

  const provider = new AnchorProvider(rpcConnection, window.solana, {
    commitment: "finalized",
  });

  const program = new Program(idl, programId, provider);

  const connectPhantom = async () => {
    try {
      const solana = window.solana;
      if (solana) {
        const walletConnection = await solana.connect();
        setWalletAddress(walletConnection.publicKey.toString());

        const usebalance = await rpcConnection.getBalance(
          new PublicKey(walletConnection.publicKey.toString())
        );

        console.log("User's balance is: ", usebalance / LAMPORTS_PER_SOL);
      } else {
        console.log("Phantom wallet not found. Please install it.");
      }
    } catch (error) {
      console.log("Some Error Occurred: ", error);
    }
  };

  const readContract = async () => {
    try {
      const val = await program.account.hits.fetch(hits);
      console.log("Value is: ", val);
    } catch (error) {
      console.log("Error Calling Program Method: ", error);
    }
  };

  const registerUser = async () => {
    try {
      // Fetch recent blockhash
      const { blockhash } = await rpcConnection.getRecentBlockhash();

      const tx = await program.methods
        .participate()
        .accounts({
          hits: hits,
          signer: new PublicKey(walletAddress),
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      // Set the recent blockhash and fee payer
      tx.recentBlockhash = blockhash;
      tx.feePayer = new PublicKey(walletAddress);

      // Sign the transaction with Phantom
      const signedTx = await window.solana.signTransaction(tx);

      // Send and confirm the transaction
      const signature = await rpcConnection.sendRawTransaction(signedTx.serialize());
      await rpcConnection.confirmTransaction(signature, "confirmed");

      console.log("User Registration Successful: ", signature);
    } catch (error) {
      console.log("Error adding user: ", error);
    }
  };

  useEffect(() => {
    connectPhantom();
  }, []); // Add empty dependency array to run only once

  return (
    <>
      <h1>Hello World</h1>
      <p>{walletAddress}</p>
      <button onClick={readContract}>Helo</button>
      <button onClick={registerUser}>Add</button>
    </>
  );
}

export default App;
