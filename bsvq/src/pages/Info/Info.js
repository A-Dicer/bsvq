import React, { Component } from "react";
// import API from "../../utils/API";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTwitter } from '@fortawesome/free-brands-svg-icons';
// import { faUserPlus, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import "./Info.css";

class Info extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }
  
  componentDidMount() {}

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
            Info
          </div>
        </div>  
      </div>
    );
  }
}

export default Info;