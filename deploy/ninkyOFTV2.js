const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")
const DEPLOY_CONFIG = require("../constants/chainIds.json")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    const lzEndpointAddress = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint Address: ${lzEndpointAddress}`)

    const ninkyOFTName = DEPLOY_CONFIG["OFTV2"].name
    const ninkyOFTSymbol = DEPLOY_CONFIG["OFTV2"].symbol
    const sharedDecimal = DEPLOY_CONFIG["OFTV2"].sharedDecimal

    await deploy("OFTV2", {
        from: deployer,
        args: [ninkyOFTName, ninkyOFTSymbol, sharedDecimal, lzEndpointAddress],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["ninkyOFTV2"]
