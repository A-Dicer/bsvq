import React, { Component } from "react";
import {Slide} from "../../components/Slide";
import API from "../../utils/API";
import { Element , Events, animateScroll as scroll, scroller } from 'react-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCaretSquareDown, faCaretSquareUp } from '@fortawesome/free-solid-svg-icons';
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
      caret: true,
      slideHover: 1,
      prevOpacity: 0,
    }
  }

  componentDidMount() {
    //event for keydown -------------
    document.addEventListener("keydown", this.keyCall);
   
    //socket IO -------------
    const io = require('socket.io-client')  
    socket = io() 

    //updates if someone changes slide 
    socket.on(this.state.proID, (payload) => {
      this.setState({slidePos: payload})
      this.btnScroll(payload)
    })

    //updates on page loading: sets slide number
    socket.on(`${this.state.proID}check`, (payload) => {
      this.setState({slidePos: payload})
      this.btnScroll(payload)
    })

    //sends id to check slide number on page load
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

// -------------------------------------------- buildArr ----------------------------------------------------
  buildArr(num){
      let arr = []
      for(let i=0; i < num; i++){arr.push('')}
      this.setState({slideArr: arr})
  }

// -------------------------------------------- keyCall -----------------------------------------------------
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
      containerId: 'slideBtn',
      smooth: true,
      offset: -42
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
          {/* -------------------------------- headerImg -------------------------------------- */}
          <div className="col-12">
            <img id="logo" src={require(`../../assets/images/bsdv_logo_transparent.png`)}/> 
          </div>
          {/* -------------------------------- controler -------------------------------------- */}
          <div className="col-12">
            <div id="controller" className="row">
              {/* ----------------------------- slides ---------------------------------------- */}
              <div className="col-12">
                <Slide proID={this.state.proID} slidePos={this.state.slidePos}/>
              </div>
              {/* --------------------------- empty menu -------------------------------------- */}
              
              {/* --------------------------- back button-------------------------------------- */}
              <div className="col-12">
                <button 
                  className="col-6 btn btn-primary dirBtn" 
                  onClick={this.btnCall} 
                  disabled={this.state.slidePos <= 1 ? true : false} 
                  id="back"
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> Back
                </button>
                {/* ----------------------- forward button ------------------------------------ */}
                <button 
                  className="col-6 btn btn-primary dirBtn" 
                  onClick={this.btnCall} 
                  disabled={this.state.slidePos >= this.state.slideAmt ? true : false}
                  id='forward'
                >
                  Forward <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
              {/* ------------------------------ menu ----------------------------------------- */}
              <div 
                className="col-12 text-right menu" 
                onClick={()=>{
                  let pos = !this.state.caret
                  this.setState({caret: pos})
                  }} 
              >
                <div className='slideTitle'>
                  Current Slide: Slide {this.state.slidePos} 
                </div>  
                Slide Menu <FontAwesomeIcon 
                className="caret"
                icon={this.state.caret ? faCaretSquareDown : faCaretSquareUp} />
              </div>
              {/* ---------------------------- slideBtn --------------------------------------- */}
              <div className="col-12 slbtn" style={{height: this.state.caret ? '0' : '135px'}}>
                
                <Element id="slideBtn" className="row slideBtn">
                  {this.state.slideArr.map((name, i) =>    
                    <Element className="col-12" key={`slide${i+1}`} name={`slide${i+1}`}>
                      <div
                        className={`jbtn`}  
                        onClick={()=>{
                          this.btnScroll(i+1)
                          this.setState({slidePos: i+1})
                          socket.emit(`slideChange`, {id: this.state.proID, slidePos: i+1})
                        }}
                        onMouseOver={()=>{this.setState({slideHover: i+1, prevOpacity: 1})}}
                        onMouseOut={()=>{
                          this.setState({prevOpacity: 0}) 
                        }}

                        style={i+1 === this.state.slidePos ?{fontSize: `24px`, color: '#fff', cursor: 'defualt'}:null}
                      > 
                        Slide {i+1}
                      </div>               
                    </Element>
                  )}
                </Element>
                {/* --------------------------- SlideThumb -------------------------------------- */}
                <div className='slideThumb'>
                  {!this.state.prevOpacity ? <div className='slidePrev'> Slide Preview</div> : null}
                  <img 
                    src={
                        this.state.slideHover 
                        ? require(`../../assets/${this.state.proID}/Presentation/Slide${this.state.slideHover}.jpg`)
                        : null
                      }
                    style={{opacity: this.state.prevOpacity}}
                  />
                </div>
              </div>
            {/* ----------------------------------------------------------------------------- */}
            </div>
          </div>
        {/* --------------------------------------------------------------------------------- */}
        </div>  
      </div>
    );
  }
}

export default Controller;