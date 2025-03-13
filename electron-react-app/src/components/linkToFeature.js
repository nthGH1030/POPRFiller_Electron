import React from 'react';
import '../Styles.css';
import { Link } from "react-router-dom";

const LinkToFeature = ({route, imagePath, currentRoute, tooltip}) => {
    
    return (
    <div className = 
        {currentRoute === route ? 'link-To-Feature-Container': 
            'link-To-Feature-Container Inactive'}
            data-tooltip={tooltip}>
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