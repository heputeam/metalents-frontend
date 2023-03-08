// import Web3 from 'web3';
// import { ERC20Abi } from '@/web3/abi';

// export function getContract(contractAddress: string) {
//   const web3 = new Web3(Web3.givenProvider);
//   return new web3.eth.Contract(ERC20Abi, contractAddress);
// }

// export async function balanceOf(contractAddress: string, account: string) {
//   try {
//     return await getContract(contractAddress)
//       ?.methods.balanceOf(account)
//       .call();
//   } catch (err) {
//     return Promise.reject(err);
//   }
// }

// export async function approve(contractAddress: string, account: string) {
//   try {
//     return await getContract(contractAddress)
//       ?.methods.approve(contractAddress, '0xffffffffffffffffffffffffffffffff')
//       .send({
//         from: account,
//       });
//   } catch (err) {
//     return Promise.reject(err);
//   }
// }

// export async function allowance(contractAddress: string, account: string) {
//   try {
//     return await getContract(contractAddress)
//       ?.methods.allowance(account, contractAddress)
//       .call();
//   } catch (err) {}
// }

// export async function transfer(
//   contractAddress: string,
//   account: string,
//   toAddress: string,
//   amount: string,
// ) {
//   try {
//     return await getContract(contractAddress)
//       ?.methods.transfer(toAddress, amount)
//       .send({
//         from: account,
//       });
//   } catch (err) {
//     return Promise.reject(err);
//   }
// }
