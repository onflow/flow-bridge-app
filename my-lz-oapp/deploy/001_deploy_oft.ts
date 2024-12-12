import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import layerZero from '../config/layerzero.json'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    // Get the correct endpoint for the network
    const network = hre.network.name
    const endpoint =
        network === 'arbitrum-testnet'
            ? layerZero['Arbitrum-Sepolia-Testnet'].endpointV2
            : layerZero['Polygon-Amoy-Testnet'].endpointV2

    console.log(`Deploying to ${network} with endpoint: ${endpoint}`)

    const result = await deploy('MyOFT', {
        from: deployer,
        args: [
            'MyToken', // name
            'MTK', // symbol
            endpoint, // LayerZero endpoint
            deployer, // owner
        ],
        log: true,
        waitConfirmations: 1,
    })

    console.log(`Deployed MyOFT to: ${result.address}`)
}

export default func
func.tags = ['MyOFT']
