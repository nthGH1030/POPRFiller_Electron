import React from 'react';
import '../Styles.css';
import { Link } from "react-router-dom";

const LinkToFeature = ({route, imagePath, currentRoute, tooltip}) => {

    const isActive = (route ==='/' && 
        (currentRoute === '/' || currentRoute === '/generatorStep2')) ||
        (route === '/replaceTemplate' && currentRoute === '/replaceTemplate')

    return (
    <div className = 'link-To-Feature-Container' data-tooltip={tooltip}>
        <Link to = {route}>
            <div className = {isActive ? 'link-To-Feature-Description' : 
                'link-To-Feature-Description Inactive'
            }>
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