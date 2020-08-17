import React, { Component } from "react";
import API from "../../utils/API";
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChrome } from '@fortawesome/free-brands-svg-icons';
import { faImages, faTrashAlt, faCalendarCheck, faTv, faDesktop, faMobileAlt, faMobile, faFileUpload, faSearch, faKey } from '@fortawesome/free-solid-svg-icons'
import "./Info.css";
import axios from "axios";

class Info extends Component {

  constructor(props) {
    super(props);
    this.state = {
      proID: props.match.params.id,
      projName: '',
      projFiles: false,
      loading: 0,
      password: false,
      passwordInput: '',
      style: {search: {width: '65%'}},
      addDisplay: false
    }
  }
  
  componentDidMount() {
    document.body.style.backgroundImage = `url(${require('../../assets/images/background.jpg')})`;
    console.log(this.state)
    this.findAll()

  }

  onChangeHandler = (event) => this.setState({projFiles: event.target.files})

// -------------------------------------------- findAll -----------------------------------------------------
  findAll = () => {
    API.findAll({data: 'bsdemo'})
      .then(res => { 
        console.log(res.data)
        this.setState({projects: res.data.projects})
      })
  }

// ------------------------------------------ inputChange ---------------------------------------------------
  inputChange = (event) => {
    // console.log(event)
    let {value} = event.target;
    this.setState({projName: value})
  }

// ------------------------------------------ styleChange ---------------------------------------------------
  styleChange = (location, data) => {
    let style = Object(this.state.style, {})
    style[location] = data
    this.setState({style: style})
  }

// --------------------------------------- passwordInputChange ----------------------------------------------
  passwordInputChange = (event) => {
    // console.log(event)
    let {value} = event.target;
    this.setState({passwordInput: value})
    setTimeout(() => {
      if(this.state.passwordInput === "bigshoulders142") this.setState({password: true})
    }, 20);
    
  }

  // ----------------------------------------- passwordCheck -------------------------------------------------
  passwordCheck = (event) => {
    event.preventDefault()
    
  }

// ----------------------------------------- deleteProject --------------------------------------------------
  deleteProject = (data) => {
    console.log(data)
    if(window.confirm(`Are you sure you want to delete ${data}`)) API.deleteFile({data: data}).then(res => this.findAll());

  }

// --------------------------------------- addProjectDisplay ------------------------------------------------
  addProjectDisplay=()=>{
    let display = !this.state.addDisplay
    this.setState({addDisplay: display})
  }
// ------------------------------------------ addProject ----------------------------------------------------
  addProject = (event) => {
    console.log(event)
    event.preventDefault()
   
    const fd = new FormData()
    fd.set('name', this.state.projName)
    for(var x = 0; x<this.state.projFiles.length; x++) fd.append('file', this.state.projFiles[x])
    
    axios.post("/api/data/addFile", fd, {
      onUploadProgress: ProgressEvent =>{
        this.setState({loading: Math.round(ProgressEvent.loaded / ProgressEvent.total *100)})
      }
    }).then(res => {

      //Display upload completed with file amt that was uplouded...


      //reset form info
      document.getElementById('uploadForm').reset();
      this.setState({projName: ''})
      this.setState({addDisplay: false})
      //reload projects
      this.findAll()
      
    })
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
      <div className="container-fluid" id="manager"> 
        <div className="row">
          <div className="col-12"  >
            <div className="row align-items-center" id="header">
              <div className="col-sm-6">
                <img id="logo" src={require(`../../assets/images/bsdv_logo_transparent.png`)}  /> 
              </div>
              {
              !this.state.password
              ? 
              <div className="col-sm-6">
                Locked
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><FontAwesomeIcon icon={faKey} /></span>
                  </div>
                  <input 
                    className="form-control form-control-sm" 
                    type="password" 
                    value={this.state.passwordInput} 
                    onChange={this.passwordInputChange} 
                  />
                </div>
              </div>

              : 
              <div className="col-sm-6">
                <div className="input-group">
                  <div className="input-group-prepend" onClick={this.addProjectDisplay}>
                    <span className="input-group-text headLink" onClick={()=>this.state.style.search.width==='0' ? this.styleChange('search', {width: '65%'}):this.styleChange('search', {width: '0', padding: '0'})}><FontAwesomeIcon icon={faFileUpload}/></span>
                  </div>
                  <div className="input-group-prepend">
                    <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
                  </div>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    style={this.state.style.search}
                  />
                  
                </div>
              </div>
              }
            </div>
          </div>
          
          <div className="col-12" id="main" style={!this.state.addDisplay ? {display: 'block'}:{display: 'none'}}>

            <div className="row"> 
              <div className="col-3">Project</div>
              <div className="col-2">Slides</div>
              <div className="col-3">Updated</div>
              <div className="col-2 text-algin-center">Links</div>
              <div className="col-2"></div>
            </div>

            <div className="row">

            { 
            <div className="col-12">
              <div className="row"> 
                  {
                  this.state.projects
                  ? this.state.projects.map(item => 
                    <div className='col-12 project'>
                      <div className='row'>

                        <div className='col-3'>{item.name}</div>
                        <div className="col-2"><FontAwesomeIcon icon={faImages}/> {item.slides.length}</div>
                        <div className='col-3'>{moment(item.updated).format('MM/DD/YY')}</div>
                        <div className='col-2 text-align-center'><FontAwesomeIcon icon={faMobile} onClick={()=> window.open(`../controls/${item.name}`)} /> / <FontAwesomeIcon icon={faDesktop} onClick={()=> window.open(`../display/${item.name}`)} /></div> 
                        <div className='col-2' style={this.state.password ? {display: 'block'}: {display: 'none'}}><FontAwesomeIcon icon={faTrashAlt} onClick={()=> this.deleteProject(item.name)}/></div>
                    </div>
                  </div>
                
                  )
                  : null
                }
                </div>
              </div>
         
          }
            </div>
          </div>

          <div className="col-md-12" id="main" style={this.state.addDisplay ? {display: 'block'}:{display: 'none'}}>
            <div className="card" style={{color: "#000"}}>
              <div className="card-body" >
                <h3>Add New Project</h3>
                <form id='uploadForm'>
                  <div className="form-group">
                    <input className="form-control form-control-sm" onChange={this.inputChange} type="text" value={this.state.projName} placeholder="Project Name"/>
                  </div>
                  <div className="form-group">
                    <input type="file" className="form-control-file" accept="image/x-png,image/gif,image/jpeg" multiple onChange={this.onChangeHandler}/>
                  </div>
                  <button type="submit" className="btn btn-primary mb-2" disabled={this.state.projName && this.state.projFiles ? false : true} onClick={this.addProject}>Submit</button>
                  <button type="submit" className="btn btn-secondary mb-2" onClick={this.addProjectDisplay}>Cancel</button>
                </form>
              </div>
            </div>
          </div> 
          
        </div>  
      </div>
    );
  }
}

export default Info;