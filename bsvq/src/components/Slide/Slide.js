import React from "react";
import "./Slide.css";

export const Slide = props => 
    <div className="row">
        <img className="slide" src={require(`../../assets/${props.proID}/Presentation/Slide${props.slidePos}.jpg`)} alt={`Slide ${props.slidePos}`}/> 
    </div>      