import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import layerZeroConfig from '../config/layerzero.json'

// Type definition for LayerZero network config
type LayerZeroConfig = {
    [key: string]: {
        nativeChainId?: number
        eid: string
        executor: string
        endpointV2: string
        sendUln301?: string
        sendUln302: string
        receiveUln301?: string
        receiveUln302: string
    }
}

// Direct mapping between Hardhat network names and LayerZero config keys
const NETWORK_TO_LZ_CONFIG: { [key: string]: string } = {
    'sepolia-testnet': 'Ethereum-Sepolia-Testnet',
    'avalanche-testnet': 'Avalanche-Fuji-Testnet',
    'arbitrum-testnet': 'Arbitrum-Sepolia-Testnet',
    'flow-testnet': 'Flow-Testnet',
    'flow-mainnet': 'Flow-Mainnet',
    'ethereum-mainnet': 'Ethereum-Mainnet',
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const configKey = NETWORK_TO_LZ_CONFIG[network.name]
    if (!configKey) {
        throw new Error(
            `Network ${network.name} not mapped to LayerZero config. Available networks: ${Object.keys(NETWORK_TO_LZ_CONFIG).join(', ')}`
        )
    }

    const endpointAddress = (layerZeroConfig as LayerZeroConfig)[configKey].endpointV2
    if (!endpointAddress) {
        throw new Error(`No endpoint address found for LayerZero network ${configKey}`)
    }

    await deploy('PYUSDLocker', {
        from: deployer,
        args: [
            '0x6c3ea9036406852006290770bedfcaba0e23a0e8', // sepolia PYUSD address: '0xcac524bca292aaade2df8a05cc58f0a65b1b3bb9',
            endpointAddress, // _lzEndpoint: LayerZero endpoint
            deployer, // _owner: The deployer address as owner
        ],
        log: true,
        waitConfirmations: 1,
    })
}

func.tags = ['PYUSDLocker']
export default func
