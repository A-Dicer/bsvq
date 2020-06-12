import React, { Component } from "react";
import {Slide} from "../../components/Slide";
import API from "../../utils/API";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTwitter } from '@fortawesome/free-brands-svg-icons';
// import { faUserPlus, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import "./Controller.css";
let socket;

class Controller extends Component {

  constructor(props) {
    super(props);
    this.state = {
      proID: props.match.params.id, 
      slidePos: 1,
      slideAmt: false
    }
  }

  componentDidMount() {
    const io = require('socket.io-client')  
    socket = io() 
    API.slideAmt({data: this.state.proID})
      .then(res => { this.setState({slideAmt: res.data.amt})})
  }

  componentWillUnmount() {socket.emit('disconnect')}

  slideChange(payload) {this.setState({slidePos: payload})}

// ------------------------------------------- btnChange ----------------------------------------------------
  btnChange =(event)=> {
    event.preventDefault()
    let{id, value} = event.target
  
    id === `back` 
    ? this.setState({slidePos: this.state.slidePos-1}) 
    : this.setState({slidePos: this.state.slidePos+1})

    setTimeout(function(){
      console.log(this.state.slidePos)
      socket.emit(`slideChange`, {id: this.state.proID, slidePos: this.state.slidePos})
    }.bind(this),10)
  }

// -------------------------------------------- suffix ------------------------------------------------------
  suffix = (i) => {
    let j = i % 10, k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
  }
// ----------------------------------------- Frontend Code -------------------------------------------------
  render() {
    return (
      <div className="container-fluid"> 
        <div className="row">
          <div className="col-12">
            <div id="controller" className="row">
              <div className="col-12">
                <Slide proID={this.state.proID} slidePos={this.state.slidePos}/>
              </div>
              <button 
                className="col-6 btn" 
                onClick={this.btnChange} 
                disabled={this.state.slidePos <= 1 ? true : false} 
                id="back"
              >
                Back
              </button>
              <button 
                className="col-6 btn" 
                onClick={this.btnChange} 
                disabled={this.state.slidePos >= this.state.slideAmt ? true : false}
                id='forward'
              >
                Forward
              </button>
    
            </div>
          </div>
        </div>  
      </div>
    );
  }
}

export default Controller;