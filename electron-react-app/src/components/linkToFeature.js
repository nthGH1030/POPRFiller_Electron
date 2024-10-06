import React from 'react';
import '../Styles.css';
import { Link } from "react-router-dom";

const LinkToFeature = ({route, imagePath}) => {
    
    return (
    <div className = "link-To-Feature-Container">
        <Link to = {route}>
            <input type= 'image' className = 'image-icon' id = 'image' alt = 'icon'
            src = {imagePath}>
            </input>
        </Link>
    </div>
    )

}

export default LinkToFeature