import React, { Component } from "react";
import {Slide} from "../../components/Slide";
import "./Display.css";
let socket;

class Display extends Component {

  constructor(props) {
    super(props);
    this.state = {
      proID: props.match.params.id, 
      slidePos: 1,
      slidePrev: '',
      mode: true,
      alertStyle: {backgroundColor: 'red', opacity: '0'}
    }
  }
  
  componentDidMount() {

    //event for keydown -------------
    document.addEventListener("keydown", this.keyCall);

    const io = require('socket.io-client') 
    socket = io() 
    socket.on(this.state.proID, (payload) => {
      this.setState({slidePos: payload}) 
      this.slideAlert()
    })
    socket.on(`${this.state.proID}check`, (payload) => {this.setState({slidePos: payload})})
    socket.emit('posCheck', {id: this.state.proID})    
  }

  componentWillUnmount() {
    socket.emit('disconnect')
  }

// ----------------------------------------- slideAlert -----------------------------------------------------  
  slideAlert =()=>{
    let color
    let time = 0;

    if(this.state.slidePos > this.state.slidePrev) color = 'green'
    else color = 'red'
    
    for(let i = 0; i<9; i++){
      let number
      if (i%2 == 0) number = 0
      setTimeout(() => {
        let pos = {backgroundColor: color, opacity: number}
        this.setState({alertStyle: pos})
      }, time);
      time += 200;
    }
    this.setState({slidePrev: this.state.slidePos})
  }

  // ----------------------------------------- keyCall ------------------------------------------------------
  keyCall =(event)=> {
    if(event.key === 'c' || event.key === 'C' ) this.setState({mode: false});
    if(event.key === 'd' || event.key === 'D') this.setState({mode: true});
  }

// ------------------------------------------- backward -----------------------------------------------------
  backward =()=>{
      
  }
// --------------------------------------------- mode -------------------------------------------------------
  mode =()=>{
      let pos = !this.state.mode
      this.setState({mode: pos})
  }
  
// ----------------------------------------- Frontend Code -------------------------------------------------
  render() {
    return (
      <div className="container-fluid" id={this.state.mode ? "display" : "cue"}> 
        <div className="row">
          <div className="col-12">
            <div className="slideNumber" style={this.state.mode ? {display: 'none'} : null}>{`Slide ${this.state.slidePos}`}</div>
            <div className="alertDiv" style={this.state.mode ? {display: 'none'} : this.state.alertStyle}></div>
            <Slide proID={this.state.proID} slidePos={this.state.slidePos}/>
          </div>
        </div>  
      </div>
    );
  }
}

export default Display;