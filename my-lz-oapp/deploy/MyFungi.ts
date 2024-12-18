import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deploy } = hre.deployments
    const { deployer } = await hre.getNamedAccounts()

    await deploy('MyFungi', {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1,
    })
}

func.tags = ['MyFungi']
export default func 