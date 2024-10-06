import React from 'react';
import '../Styles.css';
import LinkToFeature from './linkToFeature.js'
import imageDownload from '../image/imageDownload.png';
import imageUpload from '../image/imageUpload.png';

const SideNavBar = () => {

    return (
        <div>

            <LinkToFeature
            route = "/"
            imagePath = {imageDownload}
            >
            </LinkToFeature>

            <LinkToFeature
                route = "/"
                imagePath = {imageUpload}
            >
            </LinkToFeature>

        </div>
        
    )
}

export default SideNavBar