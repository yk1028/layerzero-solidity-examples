const CHAIN_IDS = require("../constants/chainIds.json")
const ENDPOINTS = require("../constants/layerzeroEndpoints.json")

module.exports = async function (taskArgs, hre) {
    const signers = await ethers.getSigners()
    const owner = signers[0]

    const OFTV2 = await ethers.getContract("OFTV2")
    const dstChainId = CHAIN_IDS[taskArgs.targetNetwork]

    const fromAddr = "0x39A7aD65824CBFD8f2961be2EF86Ba9719e1b513"
    const toAddr = "0x31eB6A06b4f3767D702d17aBfECCAd81A66F9C7C"
    const amount = 1000000000000

    let toAddressBytes = ethers.utils.defaultAbiCoder.encode(['address'],[toAddr])

    // const endpoint = await ethers.getContractAt("ILayerZeroEndpoint", ENDPOINTS[hre.network.name])
    // let fees = await endpoint.estimateFees(dstChainId, proxyOFTV2.address, "0x", false, "0x")

    let fee = await OFTV2.estimateSendFee(dstChainId, toAddressBytes, amount, false, "0x")
    console.log(`fees: ${fee[0]}`)

    const callParams = { refundAddress: fromAddr, zroPaymentAddress: fromAddr, adapterParams: "0x" }

    // const approveTx = await ninkyContract.approve(proxyOFTV2.address, amount)
    // await approveTx.wait()

    // console.log(`approved ${approveTx.hash}`)

    let tx = await (
        await OFTV2.sendFrom(
            owner.address,
            dstChainId,
            toAddressBytes,
            amount,
            callParams,
            { value: fee[0] }
        )
    ).wait()
    console.log(`send tx: ${tx.transactionHash}`)
}
