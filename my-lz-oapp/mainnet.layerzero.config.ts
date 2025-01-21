import { MainnetV2EndpointId } from '@layerzerolabs/lz-definitions'

import layerZero from './config/layerzero.json'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'

const flowMainnet = layerZero['EVM-on-Flow-Mainnet']
const ethereumMainnet = layerZero['Ethereum-Mainnet']

const EthMainnetContract: OmniPointHardhat = {
    eid: MainnetV2EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'PYUSDLocker',
}

const FlowMainnetContract: OmniPointHardhat = {
    eid: MainnetV2EndpointId.FLOW_V2_MAINNET,
    contractName: 'USDF',
}

const config: OAppOmniGraphHardhat = {
    contracts: [{ contract: EthMainnetContract }, { contract: FlowMainnetContract }],
    connections: [
        {
            from: EthMainnetContract,
            to: FlowMainnetContract,
            config: {
                sendLibrary: ethereumMainnet.sendUln302,
                receiveLibraryConfig: {
                    receiveLibrary: ethereumMainnet.receiveUln302,
                    gracePeriod: BigInt(0),
                },
                sendConfig: {
                    executorConfig: {
                        executor: ethereumMainnet.executor,
                        maxMessageSize: 10000,
                    },
                    ulnConfig: {
                        confirmations: BigInt(0),
                        requiredDVNs: ['0x589dedbd617e0cbcb916a9223f4d1300c294236b'],
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(0),
                        requiredDVNs: ['0x589dedbd617e0cbcb916a9223f4d1300c294236b'],
                    },
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
        {
            from: FlowMainnetContract,
            to: EthMainnetContract,
            config: {
                sendLibrary: flowMainnet.sendUln302,
                receiveLibraryConfig: {
                    receiveLibrary: flowMainnet.receiveUln302,
                    gracePeriod: BigInt(0),
                },
                sendConfig: {
                    executorConfig: {
                        executor: flowMainnet.executor,
                        maxMessageSize: 10000,
                    },
                    ulnConfig: {
                        confirmations: BigInt(0),
                        requiredDVNs: ['0x6788f52439aca6bff597d3eec2dc9a44b8fee842'],
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(0),
                        requiredDVNs: ['0x6788f52439aca6bff597d3eec2dc9a44b8fee842'],
                    },
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
    ],
}

export default config
