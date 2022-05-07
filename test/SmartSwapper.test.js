const { assert } = require('chai');

const SmartSwapper = artifacts.require("SmartSwapper");
const Token = artifacts.require("TurvCoin");

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('SmartSwapper', ([deployer , investor]) => {
    let token, smartSwapper

    before(async () => {
        token = await Token.new()
        smartSwapper = await SmartSwapper.new(token.address)
        //Tranfer all turv token to smartSwapper (1 million)
        await token.transfer(smartSwapper.address, tokens('1000000'))
    })

    describe('Token deploymnet', async () => {
        it('correct token name', async () => {
            const name = await token.name()
            assert.equal(name, 'Turvcoin')
        })
    })
    
    describe('smartSwapper deployment', async () => {
        it('contract has a name', async () => {
            const name = await smartSwapper.name()
            assert.equal(name, 'SmartSwap Instant Exchange')
        })

        it('contract has token', async () => {
            const balance = await token.balanceOf(smartSwapper.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('buy tokens', async () => {
        let result
        before(async () => {
            result = await smartSwapper.buyTokens({from: investor, value: web3.utils.toWei('1', 'ether')})
        })
        it('allow buy', async () => {

            let investor_balance = await token.balanceOf(investor)
            assert.equal(investor_balance.toString(), tokens('100'))

            let smartSwapper_balance
            smartSwapper_balance = await token.balanceOf(smartSwapper.address)
            assert.equal(smartSwapper_balance.toString(), tokens('999900'))

            smartSwapper_balance = await web3.eth.getBalance(smartSwapper.address)
            assert.equal(smartSwapper_balance.toString(), web3.utils.toWei('1', 'ether'))

            const event = result.logs[0].args
            assert.equal(event.account,investor)
            assert.equal(event.token,token.address)
            assert.equal(event.amount.toString(),tokens('100').toString())
            assert.equal(event.rate.toString(),'100')
            
        })
    })

    describe('sell tokens', async () => {
        let result
        before(async () => {
            await token.approve(smartSwapper.address, tokens('100'), {from: investor} )
            result = await smartSwapper.sellTokens(tokens('100'), {from: investor})
        })
        it('allows to  sell', async () => {
            let investor_balance = await token.balanceOf(investor)
            assert.equal(investor_balance.toString(), tokens('0'))

            let smartSwapper_balance
            smartSwapper_balance = await token.balanceOf(smartSwapper.address)
            assert.equal(smartSwapper_balance.toString(), tokens('1000000'))

            smartSwapper_balance = await web3.eth.getBalance(smartSwapper.address)
            assert.equal(smartSwapper_balance.toString(), web3.utils.toWei('0', 'ether'))

            const event = result.logs[0].args
            assert.equal(event.account,investor)
            assert.equal(event.token,token.address)
            assert.equal(event.amount.toString(),tokens('100').toString())
            assert.equal(event.rate.toString(),'100')

            await smartSwapper.sellTokens(tokens('500'), {from: investor}).should.be.rejected;
        })
    })

} )