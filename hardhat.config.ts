import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'

import './tasks'

import * as dotenv from 'dotenv'

dotenv.config()

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    hardhat: {
      chainId: 31337
    },
    optimism: {
      url: `https://rpc-worlds-hwbmpbzcnh.t.conduit.xyz/`,
      accounts: [process.env.PRIVATE_KEY_OPTIMISM!]
    }
  }
}

export default config
