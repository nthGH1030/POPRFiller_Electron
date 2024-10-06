import React from 'react';
import '../Styles.css';
import LinkToFeature from './linkToFeature.js'
import imageDownload from '../image/imageDownload.png';
import imageUpload from '../image/imageUpload.png';

const SideNavBar = () => {

    return (
        <div>
            <div classname = "linkToFeatureContainer">
                <LinkToFeature
                route = "/"
                imagePath = {imageDownload}
                >
                </LinkToFeature>
            </div>
            <div classname = "linkToFeatureContainer">
            <LinkToFeature
                route = "/"
                imagePath = {imageUpload}
            >
                </LinkToFeature>
            </div>
        </div>
        
    )
}

export default SideNavBar