import { Transaction as EthereumTx } from "ethereumjs-tx";
import cron from "node-cron";
import Web3 from "web3";
import dotenv from "dotenv";
dotenv.config();

// Import the ABI and contract address of the Smart Contract
import CounterABI from "../out/Counter.sol/Counter.json";
import {
  Web3Eth,
  contract,
  sendSignedTransaction,
} from "web3/lib/commonjs/eth.exports";
import { raw } from "@prisma/client/runtime";
const contractABI = CounterABI.abi;
// console.log(contractABI);

const init = async () => {
  const web3 = new Web3(process.env.SEPOLIA_RPC_URL); // Replace <provider-url> with the actual URL of the Ethereum provider
  // const bal = web3.eth.getBalance(<string>process.env.MY_ADDRESS);
  // console.log(bal);

  // Create an instance of the Smart Contract using the ABI and contract address
  // const contractAddress = process.env.CONTRACT_ADDRESS;
  const counterContract = new web3.eth.Contract(
    contractABI,
    "0x5a76D8a2BAD252fe57fb5281029a46C65d96aF52"
  );
  // const pk = Buffer.from(<string>process.env.PRIVATE_KEY, 'hex');
  const pk = <string>process.env.PRIVATE_KEY;

  const counterValue = await counterContract.methods.getCounter().call();
  console.log(counterValue);
  console.log("1----");

  await web3.eth
    .getTransactionCount(<string>process.env.MY_ADDRESS)
    .then(async (nonce) => {
      const txnObject = {
        nonce: web3.utils.toHex(nonce),
        to: process.env.CONTRACT_ADDRESS,
        // gasLimit: web3.utils.toHex("8000000"),
        // gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
        data: counterContract.methods.incrementCounter().encodeABI(),
      };
      console.log("2------");
      console.log(txnObject);

      // Sign Txn
      const tx = new EthereumTx(txnObject);
      tx.sign(Buffer.from(pk, "hex"));
      const rawTx = tx.serialize();
      const signedTransactionData = "0x" + rawTx.toString("hex");
      console.log("3---------");
      console.log(signedTransactionData);

      // Broadcast Txn
      const signatureHash = await web3.eth.sendSignedTransaction(
        signedTransactionData
      );
      console.log("4-------------");
      console.log(signatureHash);
      // web3.eth.sendSignedTransaction(signedTransactionData).then((signatureHash) => {
      //   console.log(signatureHash)
      // });
    });

  const counterValue1 = await counterContract.methods.getCounter().call();
  console.log(counterValue1);
};
// cron.schedule("* * * * *", async () => {
//   const date = new Date();

//   console.log(`Counter value0`);
//   console.log(
//     `This task is running every minute - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
//   );
//   console.log(`Counter value1`);

//   // Call the incrementCounter function of the Smart Contract
//   try {
//     // counterContract.methods
//     //   .incrementCounter()
//     //   .send({ from: <string>process.env.MY_ADDRESS })
//     //   .then(async () => {
//     //     const counterValue = await counterContract.methods.getCounter().call();
//     //     console.log(`Counter value: ${counterValue}`);
//     //     console.log(`Counter value3`);
//     //   });
//     web3.eth
//       .getTransactionCount(<string>process.env.MY_ADDRESS)
//       .then(async (nonce) => {
//         const txnObject = {
//           nonce: web3.utils.toHex(nonce),
//           to: process.env.CONTRACT_ADDRESS,
//           gasLimit: web3.utils.toHex("8000000"),
//           gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
//           data: counterContract.methods.incrementCounter().encodeABI(),
//         };

//         // Sign Txn
//         const tx = new EthereumTx(txnObject);
//         tx.sign(Buffer.from(pk, "hex"));
//         const rawTx = tx.serialize();
//         const signedTransactionData = "0x" + rawTx.toString("hex");

//         // Broadcast Txn
//         const signatureHash = await web3.eth.sendSignedTransaction(
//           signedTransactionData
//         );
//         console.log(signatureHash);
//         // web3.eth.sendSignedTransaction(signedTransactionData).then((signatureHash) => {
//         //   console.log(signatureHash)
//         // });
//       }); // ... existing code
//   } catch (error) {
//     console.error("Error occurred:", error);
//   }
//   const counterValue = await counterContract.methods.getCounter().call();
//   console.log(`Counter value: ${counterValue}`);
//   console.log(`Counter value3`);
// });

init();
