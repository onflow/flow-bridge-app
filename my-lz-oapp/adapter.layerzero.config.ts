import { TestnetV2EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'

import { addresses } from './config/addresses'
import layerzero from './config/layerzero.json'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const sepoliaContract: OmniPointHardhat = {
    eid: TestnetV2EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'MyOFTAdapter',
}

const flowContract: OmniPointHardhat = {
    eid: TestnetV2EndpointId.FLOW_V2_TESTNET,
    contractName: 'MyOFTFungi',
}

const sepoliaConfig = layerzero['Ethereum-Sepolia-Testnet']
const flowConfig = layerzero['Flow-Testnet']
const arbitrumConfig = layerzero['Arbitrum-Sepolia-Testnet']

console.log('flowConfig', flowConfig)
console.log('sepoliaConfig', sepoliaConfig)
console.log('arbitrumConfig', arbitrumConfig)

const config: OAppOmniGraphHardhat = {
    contracts: [{ contract: arbitrumContract }, { contract: flowContract }],
    connections: [
        {
            from: arbitrumContract,
            to: flowContract,
        },
        {
            from: flowContract,
            to: arbitrumContract,
        },
    ],
}

export default config
