import React, { Component } from "react";
import {Slide} from "../../components/Slide";
import API from "../../utils/API";
import * as Scroll from 'react-scroll';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faChevronRight, faChevronLeft, faCaretSquareDown, faCaretSquareUp } from '@fortawesome/free-solid-svg-icons'
import "./Controller.css";
let socket;

class Controller extends Component {

  constructor(props) {
    super(props);
    this.state = {
      proID: props.match.params.id, 
      slidePos: 1,
      slideAmt: false,
      slideArr: [],
      caret: true
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyCall);

    Events.scrollEvent.register('begin', function(to, element) {
      console.log("begin", arguments);
    });
 
    Events.scrollEvent.register('end', function(to, element) {
      console.log("end", arguments);
    });
 
    scrollSpy.update();

    const io = require('socket.io-client')  
    socket = io() 

    socket.on(this.state.proID, (payload) => {this.setState({slidePos: payload})})
    socket.on(`${this.state.proID}check`, (payload) => {
      this.setState({slidePos: payload})
      this.btnScroll(payload)
    })
    socket.emit('posCheck', {id: this.state.proID}) 
    API.slideAmt({data: this.state.proID})
      .then(res => { 
        this.setState({slideAmt: res.data.amt})
        this.buildArr(res.data.amt)
      })
  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
    socket.emit('disconnect')
  }

  buildArr(num){
    console.log('arr')
      let arr = []
      for(let i=0; i < num; i++){
          arr.push('')
      }
      
      this.setState({slideArr: arr})
  }

// -------------------------------------------- keyCAll -----------------------------------------------------
  keyCall =(event)=> {
    if(event.key === 'ArrowLeft') this.slideChange(`back`);
    if(event.key === 'ArrowRight') this.slideChange(`forward`);
  }

// -------------------------------------------- btnCall -----------------------------------------------------
  btnCall =(event)=> {
    event.preventDefault()
    this.slideChange(event.target.id)
  }

// ------------------------------------------- btnScroll ----------------------------------------------------
btnScroll =(id)=> {
  scroller.scrollTo(`slide${id}`, {
    // duration: 2000,
    // delay: 100,
    // smooth: true,
    containerId: 'slideBtn',
    offset: id > this.slideAmt -5 ?null : -65, // Scrolls to element + 50 pixels down the page
    // ...
  })
}

// ------------------------------------------ slideChange ---------------------------------------------------
  slideChange =(id)=> {

    //stops anything that is less than 1 or greater than the total amount of slides
    if(this.state.slidePos <= 1 && id === 'back') return
    if(this.state.slidePos >= this.state.slideAmt && id === 'forward') return

    //changes the slide position back/forward by 1
    id === `back` 
    ? this.setState({slidePos: this.state.slidePos-1}) 
    : this.setState({slidePos: this.state.slidePos+1})

    //sends call to all pages new slide postion 
    setTimeout(function(){
      socket.emit(`slideChange`, {id: this.state.proID, slidePos: this.state.slidePos})
      this.btnScroll(this.state.slidePos)
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
      <div className="container-fluid" id="controlContainer"> 
        <div className="row">
          <div className="col-12">
            <img id="logo" src={require(`../../assets/images/bsdv_logo_transparent.png`)}/> 
          </div>
          <div className="col-12">
            <div id="controller" className="row">
              <div className="col-12">
                <Slide proID={this.state.proID} slidePos={this.state.slidePos}/>
              </div>
              <div className="col-12 menu">
                {/* <FontAwesomeIcon icon={faPlusSquare} /> */}
              </div>
              <div className="col-12">
                <button 
                  className="col-6 btn btn-primary" 
                  onClick={this.btnCall} 
                  disabled={this.state.slidePos <= 1 ? true : false} 
                  id="back"
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> Back
                </button>
                <button 
                  className="col-6 btn btn-primary" 
                  onClick={this.btnCall} 
                  disabled={this.state.slidePos >= this.state.slideAmt ? true : false}
                  id='forward'
                >
                  Forward <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
              <div className="col-12 menu">
                
              </div>
              <div className="col-12">
               
                <Element id="slideBtn" className="row slideBtn">
                  { this.state.slideArr.map((name, i) => 
                  
                      <Element className="col-12" 
                        key={`slide${i+1}`}
                        name={`slide${i+1}`}
                      >
                        <button 
                          className={`jbtn btn ${i+1 === this.state.slidePos ? 'btn-primary' : 'btn-secondary'}`}  
                          onClick={()=>{
                            this.btnScroll(i+1)
                            this.setState({slidePos: i+1})
                          }}
                          > 
                          <div id={`slide${i}`}>
                            <img className="slideThumb" src={require(`../../assets/${this.state.proID}/Presentation/Slide${i+1}.jpg`)} style={i+1 ===this.state.slidePos ? {filter: `grayscale(0)`} : null }/> 
                            <div style={i+1 ===this.state.slidePos ? {display: `none`} : null }>
                                Slide{i+1}
                            </div> 
                          </div>
                        </button>
                      </Element>
                    
                  )}
                </Element>
              </div>
            </div>
          </div>
        </div>  
      </div>
    );
  }
}

export default Controller;