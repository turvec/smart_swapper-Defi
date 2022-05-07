import React, { Component } from 'react'
import BuyTurvCoin from './BuyTurvCoin'
import SellTurvCoin from './SellTurvCoin'

class Main extends Component {

  constructor(props){
    super(props)
    this.state = {
      perform: 'sell'
    }
  }

  render() {

    let content
    if (this.state.perform === 'buy') {
        content = <BuyTurvCoin processing={this.props.processing} ethBalance={this.props.ethBalance} turvCoinBalance={this.props.turvCoinBalance} buyTurvCoins={this.props.buyTurvCoins} />
    } else {
        content = <SellTurvCoin processing={this.props.processing} ethBalance={this.props.ethBalance} turvCoinBalance={this.props.turvCoinBalance} sellTurvCoins={this.props.sellTurvCoins} />
    }

    return (
        <div id='content' >
          <div className="row">
                <div className="col-xl-4 mx-auto">
                      <ul className="nav nav-pills nav-justified mb-5" role="tablist">
                          <li className="nav-item waves-effect waves-light">
                              <button onClick={(event) => {
                                  this.setState({perform: 'buy'})
                              }} className="btn btn-outline-primary" >
                                  Ether
                              </button>
                          </li>
                          <li className="nav-item waves-effect waves-light">
                              <button onClick={(event) => {
                                  this.setState({perform: 'sell'})
                              }}  className="btn btn-outline-primary">
                                  TurvCoin
                              </button>
                          </li>
                      </ul>
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title mb-4 text-primary">Smart Swapper </h4>

                            <div className="mt-4">

                                <div className="tab-content mt-4">
                                    
                                    {content}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    );
  }
}

export default Main;
