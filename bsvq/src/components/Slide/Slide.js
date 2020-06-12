import React from "react";
import "./Slide.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

const suffix = (i) => {
    let j = i % 10, k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
}

export const Slide = props => 
    <div className="row">
        <img id="slide" src={require(`../../assets/${props.proID}/Presentation/Slide${props.slidePos}.jpg`)} alt={`Slide ${props.slidePos}`}/> 
    </div>      