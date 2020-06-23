import React, { Component } from "react";
import {Slide} from "../../components/Slide";
import API from "../../utils/API";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faArrowAltCircleRight, faCaretSquareDown, faCaretSquareUp } from "@fortawesome/free-regular-svg-icons";
import { faTimesCircle, faExpand} from '@fortawesome/free-solid-svg-icons';
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
      full: false
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
    if(event.key === 'ArrowDown') this.setState({caret: false})
    if(event.key === 'ArrowUp') this.setState({caret: true})
    if(event.key === 'f' || event.key === 'F') this.setState({full: true})
    if(event.key === 'Escape') this.setState({full: false})
  }

// -------------------------------------------- btnCall -----------------------------------------------------
  btnCall =(event)=> {
    event.preventDefault()
    this.slideChange(event.target.id)
  }

// ------------------------------------------- btnScroll ----------------------------------------------------
  btnScroll =(id)=> {
    const elmnt = document.getElementById(`slide${id}`);
    if(id > 4 || id < this.state.slideAmt - 3) {
      elmnt.scrollIntoView({behavior: "smooth", inline: "center"});
    }
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
          {/* -------------------------------- controler -------------------------------------- */}
          <div className="col-12">
            <div id="controller" className="row">
              {/* ---------------------------- logoMobile-------------------------------------- */}
              <div className="col-12 mb text-center">
                <img id="logo" src={require(`../../assets/images/bsdv_logo_transparent.png`)}/> 
                <hr/>
              </div>
              {/* -------------------------- col-8/leftside ----------------------------------- */}
              <div className="col-sm-8">
                <div id="proName">Project Name: {this.state.proID}</div>
                <div id="updated">Updated: (date updated)</div>
                <div className={`row ${this.state.full ? 'expandBackground' : ''}`}>
                  <img className={`slide ${this.state.full ? 'expandImage' : ''}`} src={require(`../../assets/${this.state.proID}/Presentation/Slide${this.state.slidePos}.jpg`)}/>
                  <FontAwesomeIcon 
                    icon={this.state.full ?faTimesCircle : faExpand} 
                    className="fullBtn dt"
                    onClick={()=> {
                      let pos = !this.state.full
                      this.setState({full: pos})
                    }}
                  />
                </div> 
              </div>

              {/* ------------------------- col-4/rightside ----------------------------------- */}
              <div className="col-sm-4">
                <div className='row'>
                  {/* ------------------------- bsLogo ---------------------------------------- */}
                  <div className="col-12 dt text-center">
                    <img id="logo" src={require(`../../assets/images/bsdv_logo_transparent.png`)}/> 
                    <hr/>
                  </div>
                  {/* ------------------------ nextSlide -------------------------------------- */}
                  <div className="col-12">
                    Next slide
                  </div>
                  <div id="slideNext" className="col-12">
                      { this.state.slidePos +1 <= this.state.slideAmt
                        ?<Slide proID={this.state.proID} slidePos={this.state.slidePos +1} />
                        :<div className="row">
                          <img className="slide" style={{ opacity: 0}} src={require(`../../assets/images/blank.png`)}/> 
                         </div>
                      }
                    <hr />
                  </div>
                  {/* ---------------------- slideControls ------------------------------------ */}
                  <div className={`col-12 arrow text-center`}>                                      
                    <FontAwesomeIcon 
                      icon={faArrowAltCircleLeft} 
                      className={`${this.state.slidePos <= 1 ? '' : 'clickable'}`}
                      onClick={()=> this.state.slidePos <= 1 ? null : this.slideChange('back')}
                    />
                    Slide {this.state.slidePos} of {this.state.slideAmt}
                    <FontAwesomeIcon 
                      icon={faArrowAltCircleRight}
                      className={`${this.state.slidePos >= this.state.slideAmt ? null : 'clickable'}`} 
                      onClick={()=> this.state.slidePos >= this.state.slideAmt ? null : this.slideChange('forward')}  
                    />
                  </div> 
                  {/* ----------------------- slideMenu --------------------------------------- */}
                  <div className="col-12 menu text-center">
                    View all slides <FontAwesomeIcon 
                      icon={this.state.caret ? faCaretSquareDown : faCaretSquareUp}
                      className="caret"
                      onClick={()=>{
                        let pos = !this.state.caret
                        this.setState({caret: pos})
                        }} 
                    />
                  </div>
                </div>             
              </div>
              {/* ------------------------- slideSelect --------------------------------------- */}
              <div className="col-12">
                <div className="row slideSelect" style={{height: this.state.caret ? '0' : window.innerWidth < 575 ?'21vw':'12vw'}}>
                  <div id="slideBtn" className="col-12" style={{display: this.state.caret ? 'none' : null}}>
                    {
                      this.state.slideArr.map((name, i) =>    
                        <div className={`thumb ${this.state.slidePos === i+1 ? 'current' :''}`} key={`slide${i+1}`} id={`slide${i+1}`}>
                          <img 
                            src={require(`../../assets/${this.state.proID}/Presentation/Slide${i+1}.jpg`)} 
                            onClick={()=>{
                              this.btnScroll(i+1)
                              this.setState({slidePos: i+1})
                              socket.emit(`slideChange`, {id: this.state.proID, slidePos: i+1})
                            }}
                          />             
                        </div>
                      )
                    }
                  </div>
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