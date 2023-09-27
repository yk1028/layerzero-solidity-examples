const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    const lzEndpointAddress = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint Address: ${lzEndpointAddress}`)

    const NINKY_ADDR = "0x782eC8Ce335e190bd98E7ca00534d0f6CDDf877F"

    await deploy("ProxyOFTV2", {
        from: deployer,
        args: [NINKY_ADDR, 6, lzEndpointAddress],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["ProxyOFTV2"]
