import Web3 from 'web3';
import { Transaction as EthereumTx } from 'ethereumjs-tx';
import dotenv from 'dotenv';
dotenv.config();

const web3 = new Web3(process.env.SEPOLIA_RPC_URL); // Replace <provider-url> with the actual URL of the Ethereum provider

/**
 * ⚠️ Promise object that is returned by the web3.eth.getBalance() function. A Promise object represents a value that may not be available yet but will be resolved at some point in the future. The Promise object is in a pending state until it is resolved.
 * To access the value of the Promise object, you need to use the .then() method. Here’s how you can modify your code to log the balance:
 */

// web3.eth.getBalance(<string>process.env.address).then((balance) => {
//   console.log(web3.utils.fromWei(balance, "ether"));})
  
import CounterABI from '../out/Counter.sol/Counter.json';
const contractABI = CounterABI.abi;
const contract = new web3.eth.Contract(contractABI, "0x90193C961A926261B756D1E5bb255e67ff9498A1");

// 5.985217703447428067
// 47571942134670.725453614323200000

// 👇 to get Functions of Contract.
// console.log(contract);

// contract.methods.getCounter().call()
//   .then((result: any) => {
  //     console.log(result);
//   })
//   .catch((error: any) => {
//     console.error(error);
//   });

// const counterValue = contract.methods.getCounter().call();
// console.log(counterValue);

// 📩 Anvil Address.
const account1 = process.env.MY_ADDRESS;
const account2 = process.env.MY_ADDRESS_1;
const privateKey1 = Buffer.from(<string>process.env.PRIVATE_KEY, 'hex');
const privateKey2 = Buffer.from(<string>process.env.PRIVATE_KEY_1, 'hex');

web3.eth.getBalance(<string>account1).then((balance) => {
  console.log("Balance of Account1: ",web3.utils.fromWei(balance, "ether"));})
web3.eth.getBalance(<string>account2).then((balance) => {
  console.log("Balance of Account2:(in Gwei) ",web3.utils.fromWei(balance, "gwei"));})

// 🔑 Creating accounts....
// console.log(web3.eth.accounts.create());

// web3.eth.sendTransaction({from : account1, to:account2, value: web3.utils.toWei("1", "ether")})

// Sending Transaction 🚌 
web3.eth.getTransactionCount(<string>account1).then((bal) => {console.log(bal)});

// get Nonce
web3.eth.getTransactionCount(<string>account1).then((nonce) => {

// create txn Objext
const txObject = {
  nonce:web3.utils.toHex(nonce),
  gasLimit:web3.utils.toHex(800000),
  gasPrice:web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
  to:process.env.CONTRACT_ADDRESS,
  data:contract.methods.getCounter().encodeABI(),
}

// sign the txns
const tx = new EthereumTx(txObject);
tx.sign(privateKey1);

const rawTx = tx.serialize(); 
const signedTransactionData = '0x'+rawTx.toString('hex');

// broadcast the transaction.
web3.eth.sendSignedTransaction(signedTransactionData)
  .on('transactionHash', (hash) => {
    console.log(`Transaction hash: ${hash}`);
  })
  .on('receipt', (receipt) => {
    console.log(`Receipt: ${receipt}`);
  })
  .on('error', (error) => {
    console.error(`Error: ${error}`);
  });

})
