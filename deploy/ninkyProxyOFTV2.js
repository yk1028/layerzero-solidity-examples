const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")
const DEPLOY_CONFIG = require("../constants/deploy-config.json")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    const lzEndpointAddress = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint Address: ${lzEndpointAddress}`)

    const ninkyTokenAddress = DEPLOY_CONFIG["ProxyOFTV2"].ninkyAddress
    const sharedDecimal = DEPLOY_CONFIG["ProxyOFTV2"].sharedDecimal

    await deploy("ProxyOFTV2", {
        from: deployer,
        args: [ninkyTokenAddress, sharedDecimal, lzEndpointAddress],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["ninkyProxyOFTV2"]
