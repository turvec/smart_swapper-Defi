import React, { Component } from 'react'
import './App.css'
import Identicon from 'identicon.js'

class Header extends Component {

  render() {

    return (
      <nav className="navbar navbar-dark navbar-expand-sm sticky-top bg-success d-flex justify-content-between mb-5 shadow">
          <a
            className="ml-2 bg-white text-success navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            Smart Swapper
          </a>

          <div className='p-4 d-flex text-white'>
            <p className='bg-white text-success p-2'>{this.props.account}</p>
            {
             this.props.account 
             ?
             <div>
               <img 
                className='ml-2'
                height={30}
                width={30}
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString() }`}
                alt=''
               />
             </div>
             :
             <div></div>
            }
          </div>
      </nav>
    );
  }
}

export default Header;
