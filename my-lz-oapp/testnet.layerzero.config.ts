import { TestnetV2EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'

import layerZero from './config/layerzero.json'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const flowTestnet = layerZero['EVM-on-Flow-Testnet']
const sepoliaTestnet = layerZero['Ethereum-Sepolia-Testnet']

const sepoliaContract: OmniPointHardhat = {
    eid: TestnetV2EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'PYUSDLocker',
}

const flowContract: OmniPointHardhat = {
    eid: TestnetV2EndpointId.FLOW_V2_TESTNET,
    contractName: 'USDF',
}

const config: OAppOmniGraphHardhat = {
    contracts: [{ contract: sepoliaContract }, { contract: flowContract }],
    connections: [
        {
            from: flowContract,
            to: sepoliaContract,
            config: {
                sendLibrary: flowTestnet.sendUln302,
                receiveLibraryConfig: {
                    receiveLibrary: flowTestnet.receiveUln302,
                    gracePeriod: BigInt(0),
                },
                enforcedOptions: [
                    {
                        msgType: 1,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: BigInt(230000),
                    },
                ],
            },
        },
        {
            from: sepoliaContract,
            to: flowContract,
            config: {
                sendLibrary: sepoliaTestnet.sendUln302,
                receiveLibraryConfig: {
                    receiveLibrary: sepoliaTestnet.receiveUln302,
                    gracePeriod: BigInt(0),
                },
                enforcedOptions: [
                    {
                        msgType: 1,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: BigInt(253000),
                    },
                ],
            },
        },
    ],
}

export default config
