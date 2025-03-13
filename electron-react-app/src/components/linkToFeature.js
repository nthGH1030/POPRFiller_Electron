import React from 'react';
import '../Styles.css';
import { Link } from "react-router-dom";

const LinkToFeature = ({route, imagePath, currentRoute, tooltip}) => {

    let divContainerClass = "link-To-Feature-Container"

    divContainerClass += currentRoute === route ? " Active" : "";
    
    return (
    <div className = {divContainerClass} data-tooltip={tooltip}>
        <Link to = {route}>
            <div className = 'link-To-Feature-Description'>
                <img 
                    className = 'image-icon'
                    alt = 'Link to page'
                    src = {imagePath}
                />
                <h5>Link</h5>
            </div>
        </Link>
    </div>
    )

}

export default LinkToFeature