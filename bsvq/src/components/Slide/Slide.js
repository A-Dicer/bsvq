import React from "react";
import "./Slide.css";

export const Slide = props => 
    <div className="row">
        <img className="slide" src={require(`../../assets/${props.proID}/${props.slidePos}`)} alt={`${props.slidePos}`}/> 
    </div>      