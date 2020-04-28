const Web3 = require('web3')
const ABI = require('./abi')
const Contract = require('./mainnet-crab-contract')
const PolkadotUtilCrypto = require('@polkadot/util-crypto')
const PolkadotUtil = require('@polkadot/util')
const TEST_DARWINIA_ADDRESS = '5Gn9u2C1AkMfWEPp7QH8qDBHwHVtgfLM4SQ3RVx3TTFVMrVH';

var Eth = require('ethjs')
window.Eth = Eth
console.log('new V2')

function ss58ToHex(ss58) {
    return '0x2a' + PolkadotUtil.u8aToHex(PolkadotUtilCrypto.decodeAddress(ss58), -1, false)
}

connectButton.addEventListener('click', function () {
    connect()
})

function connect() {
    if (typeof ethereum !== 'undefined') {
        ethereum.enable()
            .catch(console.error)
    }
}

function getAccount() {
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts((err, accounts) => {
            resolve(accounts[0])
        });
    })
}

async function initWeb3js() {

    window.pageWeb3js = new Web3(window.web3.currentProvider);

    window.pageContract = {
        ring: new window.pageWeb3js.eth.Contract(ABI.ring, Contract.ring),
        kton: new window.pageWeb3js.eth.Contract(ABI.ring, Contract.kton),
        bank: new window.pageWeb3js.eth.Contract(ABI.bank, Contract.bank),
    }
    const account = await getAccount()
    $('#etherscanButton').attr('href', 'https://etherscan.io/address/' + account)
    $('#getDepositsAddressValue').val(account)
}

burndropRingButton.addEventListener('click', async function (event) {
    event.preventDefault()
    const from = await getAccount()
    if (!from) return connect()

    window.pageContract.ring.methods['transferFrom(address,address,uint256,bytes)'](from, Contract.burndrop, $('#burndropRingValue').val(), ss58ToHex($('#burndropRingDarwiniaValue').val())).send({
        from: from
    }).then(function (receipt) {
        console.log(receipt)
    })
})

burndropKtonButton.addEventListener('click', async function (event) {
    event.preventDefault()
    const from = await getAccount()
    if (!from) return connect()

    window.pageContract.kton.methods['transferFrom(address,address,uint256,bytes)'](from, Contract.burndrop, $('#burndropKtonValue').val(), ss58ToHex($('#burndropKtonDarwiniaValue').val())).send({
        from: from
    }).then(function (receipt) {
        console.log(receipt)
    })
})

depositRingButton.addEventListener('click', async function (event) {
    event.preventDefault()
    const from = await getAccount()
    if (!from) return connect()

    window.pageContract.ring.methods['transferFrom(address,address,uint256,bytes)'](from, Contract.bank, $('#depositRingValue').val(), window.pageWeb3js.utils.toTwosComplement($('#depositRingMonthValue').val())).send({
        from: from
    }).then(function (receipt) {
        console.log(receipt)
    })
})

getDepositsButton.addEventListener('click', async function (event) {
    event.preventDefault()
    const from = await getAccount()
    if (!from) return connect()

    window.pageContract.bank.methods['getDepositIds(address)']($('#getDepositsAddressValue').val()).call({
        from: from
    }).then(function (result) {
        console.log(result)
        $('#params_deposits').val(result.toString())

    })
})

getDepositInfoButton.addEventListener('click', async function (event) {
    event.preventDefault()
    const from = await getAccount()
    if (!from) return connect()

    window.pageContract.bank.methods['getDeposit(uint256)']($('#depositIDValue').val()).call({
        from: from
    }).then(function (result) {
        console.log(result)
        $('#params_depositID').val($('#depositIDValue').val())
        $('#params_depositor').val(result[0])
        $('#params_months').val(result[2])
        $('#params_startAt').val(result[3])
        $('#params_unitInterest').val(result[4])
        $('#params_value').val(result[1])
        $('#params_claimed').val(result[5])
    })
})

burndropDepositButton.addEventListener('click', async function (event) {
    event.preventDefault()
    const from = await getAccount()
    if (!from) return connect()
    window.pageContract.bank.methods['burndrop(uint256,address,uint48,uint48,uint64,uint128,bytes)'](
        $('#params_depositID').val(),
        $('#params_depositor').val(),
        $('#params_months').val(),
        $('#params_startAt').val(),
        $('#params_unitInterest').val(),
        $('#params_value').val(),
        ss58ToHex($('#burndropDepositDarwiniaValue').val())
    ).send({
        from: from
    }).then(function (receipt) {
        console.log(receipt)
    })
})

$('.container').on('click', '.useCrabTestAddress' ,function() {
    $(this).parents('.input-group').find('input').val(TEST_DARWINIA_ADDRESS)
})


setTimeout(() => {
    initWeb3js()
}, 2000)
