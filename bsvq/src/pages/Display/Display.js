import React, { Component } from "react";
import {Slide} from "../../components/Slide";
// import API from "../../utils/API";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTwitter } from '@fortawesome/free-brands-svg-icons';
// import { faUserPlus, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import "./Display.css";
let socket;
// const time = toString(new Date())

class Display extends Component {

  constructor(props) {
    super(props);
    this.state = {
      proID: props.match.params.id, 
      slidePos: 1 
    }
  }
  
  componentDidMount() {
    const io = require('socket.io-client')  
    socket = io() 
    socket.on(this.state.proID, (payload) => {this.setState({slidePos: payload})})
    socket.on(`${this.state.proID}check`, (payload) => {this.setState({slidePos: payload})})
    socket.emit('posCheck', {id: this.state.proID}) 
  }

  componentWillUnmount() {socket.emit('disconnect')}

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
            <Slide proID={this.state.proID} slidePos={this.state.slidePos}/>
          </div>
        </div>  
      </div>
    );
  }
}

export default Display;