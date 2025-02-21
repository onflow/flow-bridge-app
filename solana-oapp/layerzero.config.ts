import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import layerZero from './config/layerzero.json'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'
import { ExecutorPDADeriver } from '@layerzerolabs/lz-solana-sdk-v2'
import { PublicKey } from '@solana/web3.js'

const flowMainnet = layerZero['EVM-on-Flow-Mainnet']
const solanaMainnet = layerZero["Solana-Mainnet"]
// Note:  Do not use address for EVM OmniPointHardhat contracts.  Contracts are loaded using hardhat-deploy.
// If you do use an address, ensure artifacts exists.
const flowContract: OmniPointHardhat = {
    eid: EndpointId.FLOW_V2_MAINNET,
    contractName: 'USDF',
}

const solanaContract: OmniPointHardhat = {
    eid: EndpointId.SOLANA_V2_MAINNET,
    address: '2KUb8dcZR9LyrSg4RdkQx91xX6mPQLpS1MEo6gwfvLZk', // NOTE: update this with the OFTStore address.
}


const executorPublicKey = new PublicKey(solanaMainnet.executor);
const executorPDA = new ExecutorPDADeriver(executorPublicKey).config()

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: flowContract,
        },
        {
            contract: solanaContract,
        },
    ],
    connections: [
        {
            from: flowContract,
            to: solanaContract,
            // NOTE: Here are some default settings that have been found to work well sending to Solana.
            // You need to either enable these enforcedOptions or pass in extraOptions when calling send().
            // Having neither will cause a revert when calling send().
            // We suggest performing additional profiling to ensure they are correct for your use case.
            config: {
                enforcedOptions: [
                    {
                        msgType: 1,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: 200000,
                        value: 200000,
                    },
                    {
                        msgType: 2,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: 200000,
                        value: 200000,
                    },
                    {
                        // Solana options use (gas == compute units, value == lamports)
                        msgType: 2,
                        optionType: ExecutorOptionType.COMPOSE,
                        index: 0,
                        gas: 0,
                        value: 0,
                    },
                ],

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
            },
        },
        {
            from: solanaContract,
            to: flowContract,
            // TODO Here are some default settings that have been found to work well sending to Sepolia.
            // You need to either enable these enforcedOptions or pass in extraOptions when calling send().
            // Having neither will cause a revert when calling send().
            // We suggest performing additional profiling to ensure they are correct for your use case.
            config: {
                sendLibrary: solanaMainnet.sendUln302,
                receiveLibraryConfig: {
                    receiveLibrary: solanaMainnet.receiveUln302,
                    gracePeriod: BigInt(10),
                },
                // Optional Send Configuration
                // @dev Controls how the `from` chain sends messages to the `to` chain.
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 10000,
                        // The configured Executor address.  Note, this is the executor PDA not the program ID.
                        // executor: 'AwrbHeCyniXaQhiJZkLhgWdUCteeWSGaSN1sTfLiY7xK',
                        executor: executorPDA[0].toString(),
                    },
                    ulnConfig: {
                        // // The number of block confirmations to wait before emitting the message from the source chain.
                        confirmations: BigInt(0),
                        // The address of the DVNs you will pay to verify a sent message on the source chain ).
                        // The destination tx will wait until ALL `requiredDVNs` verify the message.
                        requiredDVNs: [
                            '4VDjp6XQaxoZf5RGwiPU9NR1EXSZn2TP4ATMmiSzLfhb', // LayerZero
                        ],
                        // The address of the DVNs you will pay to verify a sent message on the source chain ).
                        // The destination tx will wait until the configured threshold of `optionalDVNs` verify a message.
                        optionalDVNs: [],
                        // The number of `optionalDVNs` that need to successfully verify the message for it to be considered Verified.
                        optionalDVNThreshold: 0,
                    },
                },
                // Optional Receive Configuration
                // @dev Controls how the `from` chain receives messages from the `to` chain.
                receiveConfig: {
                    ulnConfig: {
                        // The number of block confirmations to expect from the `to` chain.
                        confirmations: BigInt(0),
                        // The address of the DVNs your `receiveConfig` expects to receive verifications from on the `from` chain ).
                        // The `from` chain's OApp will wait until the configured threshold of `requiredDVNs` verify the message.
                        requiredDVNs: [
                            '4VDjp6XQaxoZf5RGwiPU9NR1EXSZn2TP4ATMmiSzLfhb', // LayerZero
                        ],
                        // The address of the DVNs you will pay to verify a sent message on the source chain ).
                        // The destination tx will wait until the configured threshold of `optionalDVNs` verify a message.
                        optionalDVNs: [],
                        // The number of `optionalDVNs` that need to successfully verify the message for it to be considered Verified.
                        optionalDVNThreshold: 0,
                    },
                },
                enforcedOptions: [
                    {
                        msgType: 1,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: 200000,
                    },
                    {
                        msgType: 2,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: 200000,
                    },
                ],
            },
        },
    ],
}

export default config
