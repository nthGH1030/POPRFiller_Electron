import React from 'react';
import '../Styles.css';
import { Link } from "react-router-dom";

const LinkToFeature = ({route, imagePath, currentRoute, tooltip}) => {

    let divContainerClass = "link-To-Feature-Container"

    divContainerClass += currentRoute === route ? " Active" : "";
    
    return (
    <div className = {divContainerClass} data-tooltip={tooltip}>
        <Link to = {route}>
            <input type= 'image' className = 'image-icon' id = 'image' alt = 'icon'
            src = {imagePath}>
            </input>
        </Link>
    </div>
    )

}

export default LinkToFeature