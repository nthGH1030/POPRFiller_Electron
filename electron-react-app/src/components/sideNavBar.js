import React, {useState} from 'react';
import '../Styles.css';
import LinkToFeature from './linkToFeature.js'
import imageDownload from '../image/imageDownload.png';
import imageUpload from '../image/imageUpload.png';


const SideNavBar = ({currentRoute}) => {

    return (
        <div>
            <LinkToFeature
            route = "/"
            imagePath = {imageDownload}
            currentRoute = {currentRoute}
            >
            </LinkToFeature>

            <LinkToFeature
                route = "/replaceTemplate"
                imagePath = {imageUpload}
                currentRoute = {currentRoute}
            >
            </LinkToFeature>

        </div>
        
    )
}

export default SideNavBar