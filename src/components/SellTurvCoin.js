import React, { Component } from 'react'
import turvLogo from '../assets/turvcoin1.jpg'
import ethLogo from '../assets/eth.png'

class SellTurvCoin extends Component {

  constructor(props){
    super(props)
    this.state = {
      output: 0,
    }
  }

  render() {
    let action
    if (this.props.processing === true) {
      action = <button type='button' disabled  className="btn btn-primary w-md">Loading...</button>
    } else {
      action = <button  className="btn btn-primary w-md">Swap</button>
    }

    return (
        <div>
        <form onSubmit={(event) => {
          event.preventDefault()
          let turvCoinAmount
          turvCoinAmount = this.input.value.toString()
          turvCoinAmount = window.web3.utils.toWei(turvCoinAmount, 'Ether')
          this.props.sellTurvCoins(turvCoinAmount)
          }} >
            <div>
            <div className="d-flex justify-content-between">
                    <h6 className="text-success mb-3">DEPOSIT </h6>
                    <small className="text-secondary mb-3">TurvCoin Balance: {window.web3.utils.fromWei(this.props.turvCoinBalance, 'Ether')} </small>
                </div>

                <div className="input-group mb-3">
                   
                    <input type="text" className="form-control" placeholder="Turv Equiv." 
                    onChange={(event) => {
                       const turvCoinAmount = this.input.value.toString()
                       this.setState({output: turvCoinAmount / 100}) 
                      }} 
                    ref={(input) => {this.input = input}} 
                    />
                    <label className="input-group-text">
                    <img src={turvLogo} height='22' alt='' />
                    <select className="form-select ml-2 bg-success text-white" style={{maxWidth: '90px'}}>
                        <option  >
                          TURV
                        </option>
                    </select>
                    </label>
                </div>

                

                <div className="d-flex justify-content-between">
                    <h6 className="text-success mb-3">RECEIVE </h6>
                    <small className="text-secondary mb-3">Ether Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'Ether')} </small>
                </div>

                <div className="input-group mb-3">
                    <input type="text" className="form-control" disabled value={this.state.output} placeholder="Eth Equiv." />
                    <label className="input-group-text">
                    <img src={ethLogo} height='22' alt='' />
                    <select className="form-select ml-2 bg-success text-white" style={{maxWidth: '90px'}}>
                        <option  >
                          ETH
                        </option>
                    </select>
                    </label>
                </div>
                
                <div className="d-flex justify-content-between">
                    <small className="text-secondary mb-3">Charge: 0.021% </small>
                    <small v-if="chargeNgn > 0" className="text-secondary mb-3">100 TURV = 1 ETH </small>
                </div>
            </div>

            <div className="text-center">
                {action}
            </div>
        </form>
    </div>
    );
  }
}

export default SellTurvCoin;
