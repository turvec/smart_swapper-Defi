import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import Header from './Header'
import Main from './Main'
import SmartSwapper from '../abis/SmartSwapper.json'
import TurvCoin from '../abis/TurvCoin.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0] })

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance })

    //get the deployed network id
    const networkId = await web3.eth.net.getId()

    //load turvCoin
    const turvCoinData = TurvCoin.networks[networkId]

    if(!turvCoinData){
      return window.alert('token contract not deployed to detected network')
    }
    const turvCoinContract = new web3.eth.Contract( TurvCoin.abi, turvCoinData.address)
    this.setState({ turvCoinContract })
    let turvcoinBalance = await turvCoinContract.methods.balanceOf(this.state.account).call()
    console.log('tokenbalance: ', turvcoinBalance);
    this.setState({ turvCoinBalance: turvcoinBalance.toString() })

    //load smartSwapper
    const smartSwapperData = SmartSwapper.networks[networkId]

    if(!smartSwapperData){
      return window.alert('SmartSwapper contract not deployed to detected network')
    }
    const smartSwapper = new web3.eth.Contract( SmartSwapper.abi, smartSwapperData.address)
    this.setState({ smartSwapper })
    this.setState({ loading: false})
  }

  async loadWeb3(){
     // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  buyTurvCoins = (etherAmount) => {
    this.setState({processing: true})
    this.state.smartSwapper.methods.buyTokens()
    .send({from: this.state.account, value: etherAmount})
    .on('transactionHash', (hash) => {this.setState({processing: false})})
  }

  sellTurvCoins = (turvCoinAmount) => {
    this.setState({processing: true})
    this.state.turvCoinContract.methods.approve(this.state.smartSwapper.address, turvCoinAmount)
    .send({from: this.state.account})
    .on('transactionHash', (hash) => 
    {
      this.state.smartSwapper.methods.sellTokens(turvCoinAmount)
      .send({from: this.state.account })
      .on('transactionHash', (hash) => {this.setState({processing: false})})
    } )
  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      ethBalance: 0,
      turvCoinBalance: 0,
      turvCoinContract: {},
      smartSwapper: {},
      loading: true,
      processing: false,
    }
  }
  

  render() {

    let content 
    if (this.state.loading) {
      content =  <div className='row mt-5 '>
              <div className='col-md-4 card card-body shadow'>
              <h2 className='text-success'>loading...</h2>
              </div>
            </div>
    } else {
      content = <Main processing={this.state.processing} ethBalance={this.state.ethBalance} turvCoinBalance={this.state.turvCoinBalance} buyTurvCoins={this.buyTurvCoins} sellTurvCoins={this.sellTurvCoins} />
    }

    return (
      <div >
       <Header account = {this.state.account} />
        <div className="container-fluid mt-20">
          <div className="row">
            <main role="main" className="col-lg-12 ">
              <div className="content mr-auto ml-auto">
                {content}
              </div> 
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
