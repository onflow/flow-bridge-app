import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import * as layerzero from '../config/layerzero.json'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deploy, get } = hre.deployments
    const { deployer } = await hre.getNamedAccounts()

    // Get the deployed MyFungi contract
    const myFungi = await get('MyFungi')

    const networkName = 'Arbitrum-Sepolia-Testnet'
    // Get the correct network configuration based on the current network
    if (hre.network.name !== 'arbitrum-testnet') throw new Error(`Network ${hre.network.name} is not supported`)

    const networkEndpointAddresses = layerzero[networkName]
    if (!networkEndpointAddresses?.endpointV2) {
        throw new Error(`No LayerZero endpoint found for network ${networkName}`)
    }

    await deploy('MyOFTAdapter', {
        from: deployer,
        args: [
            myFungi.address, // The address of your ERC20 token
            networkEndpointAddresses.endpointV2, // LayerZero endpoint address
            deployer, // Owner
        ],
        log: true,
        waitConfirmations: 1,
    })
}

func.tags = ['MyOFTAdapter']
func.dependencies = ['MyFungi']

export default func
