const CHAIN_IDS = require("../constants/chainIds.json")
const ENDPOINTS = require("../constants/layerzeroEndpoints.json")

module.exports = async function (taskArgs, hre) {
    const signers = await ethers.getSigners()
    const owner = signers[0]

    const abi = [
        {
            "inputs": [
              {
                "internalType": "address",
                "name": "spender",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "approve",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
    ]
    let provider = ethers.getDefaultProvider();
    const ninkyTokenAddress = "0x782ec8ce335e190bd98e7ca00534d0f6cddf877f" 

    let ninkyContract = new ethers.Contract(ninkyTokenAddress, abi, provider).connect(owner);

    const proxyOFTV2 = await ethers.getContract("ProxyOFTV2")
    const dstChainId = CHAIN_IDS[taskArgs.targetNetwork]

    const fromAddr = "0x31eB6A06b4f3767D702d17aBfECCAd81A66F9C7C"
    const toAddr = "0x39A7aD65824CBFD8f2961be2EF86Ba9719e1b513"
    const amount = 1000000

    let toAddressBytes = ethers.utils.defaultAbiCoder.encode(['address'],[toAddr])

    let fee = await proxyOFTV2.estimateSendFee(dstChainId, toAddressBytes, amount, false, "0x")
    console.log(`fees: ${fee[0]}`)

    const callParams = { refundAddress: fromAddr, zroPaymentAddress: fromAddr, adapterParams: "0x" }

    const approveTx = await ninkyContract.approve(proxyOFTV2.address, amount)
    await approveTx.wait()

    console.log(`approved ${approveTx.hash}`)

    let tx = await (
        await proxyOFTV2.sendFrom(
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
