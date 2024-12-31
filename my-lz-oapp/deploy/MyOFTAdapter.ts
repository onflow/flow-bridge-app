import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import layerZeroConfig from '../config/layerzero.json'

// Type definition for LayerZero network config
type LayerZeroConfig = {
    [key: string]: {
        nativeChainId?: number;
        eid: string;
        executor: string;
        endpointV2: string;
        sendUln301?: string;
        sendUln302: string;
        receiveUln301?: string;
        receiveUln302: string;
    }
}

// Direct mapping between Hardhat network names and LayerZero config keys
const NETWORK_TO_LZ_CONFIG: { [key: string]: string } = {
    'sepolia-testnet': 'Ethereum-Sepolia-Testnet',
    'avalanche-testnet': 'Avalanche-Fuji-Testnet',
    'arbitrum-testnet': 'Arbitrum-Sepolia-Testnet',
    'flow-testnet': 'Flow-Testnet'
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const configKey = NETWORK_TO_LZ_CONFIG[network.name]
    if (!configKey) {
        throw new Error(`Network ${network.name} not mapped to LayerZero config. Available networks: ${Object.keys(NETWORK_TO_LZ_CONFIG).join(', ')}`)
    }

    const endpointAddress = (layerZeroConfig as LayerZeroConfig)[configKey].endpointV2
    if (!endpointAddress) {
        throw new Error(`No endpoint address found for LayerZero network ${configKey}`)
    }

    // First deploy MyFungi
    const myFungi = await deploy('MyFungi', {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1,
    })

    // Then deploy MyOFTAdapter with MyFungi address
    await deploy('MyOFTAdapter', {
        from: deployer,
        args: [
            myFungi.address,      // _token: The deployed MyFungi token address
            endpointAddress,      // _lzEndpoint: LayerZero endpoint
            deployer             // _owner: The deployer address as owner
        ],
        log: true,
        waitConfirmations: 1,
    })
}

func.tags = ['MyOFTAdapter', 'MyFungi']
export default func
