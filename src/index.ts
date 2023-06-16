import cron from 'node-cron';
import Web3 from 'web3';
import dotenv from 'dotenv';
dotenv.config();

// Import the ABI and contract address of the Smart Contract
import CounterABI from '../out/Counter.sol/Counter.json';
import { env } from 'process';
const contractABI = CounterABI.abi;

const web3 = new Web3(process.env.SEPOLIA_RPC_URL); // Replace <provider-url> with the actual URL of the Ethereum provider

// Create an instance of the Smart Contract using the ABI and contract address
const contractAddress = process.env.CONTRACT_ADDRESS; // Replace <contract-address> with the actual address of the deployed contract
const counterContract = new web3.eth.Contract(contractABI, contractAddress);

cron.schedule(
  '* * * * *',
  async () => {
    const date = new Date();

    console.log(`This task is running every minute - ${date.getHours()}:${date.getMinutes()}`);

    // Call the incrementCounter function of the Smart Contract
    await counterContract.methods.incrementCounter().send({ from: process.env.MY_ADDRESS });
    
    // Call the getCounter function to fetch the updated counter value
    const counterValue = await counterContract.methods.getCounter().call();
    console.log(`Counter value: ${counterValue}`);
  }
  // {
  //   scheduled: true,
  //   timezone: 'Asia/Calcutta',
  //   name: 'simple-task',
  //   recoverMissedExecutions: false,
  // },
);