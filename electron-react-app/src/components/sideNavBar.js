import React, {useState} from 'react';
import '../Styles.css';
import LinkToFeature from './linkToFeature.js'
import imageDownload from '../image/imageDownload.png';
import imageUpload from '../image/imageUpload.png';
import imageSelect from '../image/imageSelect.png';


const SideNavBar = ({currentRoute}) => {

    return (
        <>
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

            <LinkToFeature
                route = "/selectTemplate"
                imagePath = {imageSelect}
                currentRoute = {currentRoute}
            >
            </LinkToFeature>

        </>
        
    )
}

export default SideNavBar