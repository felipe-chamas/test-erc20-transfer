import { task, types } from 'hardhat/config'
import csv from 'csvtojson'

import fs from 'fs'

export const TASK_BATCH_TRANSFER_CONTRACT = 'tx:batch-transfer-contract'

task(TASK_BATCH_TRANSFER_CONTRACT, 'Batch transfer funds from CSV')
  .addParam('contract', 'Contract Address', undefined, types.string)
  .addParam('file', 'Path to CSV file with (account, tokens)', undefined, types.string)
  .setAction(async ({ contract: contractAddress, file }, { ethers }) => {
    const list = await csv().fromFile(file)

    const [operator] = await ethers.getSigners()
    const contract = (await ethers.getContractAt('ERC20', contractAddress)).connect(operator)

    const output = file.replace('.csv', '_output.csv')
    fs.writeFileSync(output, 'begin, end, hash, status\n')

    for (const { account, tokens } of list) {
      const tx = await contract.transfer(account, tokens)
      const receipt = await tx.wait()
      if (receipt.status !== 1) {
        throw new Error(`Transaction ${tx.hash} failed!`)
      }
    }

    console.log('Successful transfer')
  })

export {}

// npx hardhat tx:batch-transfer-contract --network optimism --contract 0xbE1F1F4767A24Cf83C08d85190062b0a7497253c --file ./tmp/test.csv
