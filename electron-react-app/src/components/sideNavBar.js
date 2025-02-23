import React, {useState} from 'react';
import '../Styles.css';
import LinkToFeature from './linkToFeature.js'
import fileArrowDown from '../image/file-arrow-down.svg';
import fileImport from '../image/file-import.svg';
import imageSelect from '../image/imageSelect.png';


const SideNavBar = ({currentRoute}) => {

    return (
        <div className = 'sidebar-container'>
            <LinkToFeature
            route = "/"
            imagePath = {fileArrowDown }
            currentRoute = {currentRoute}
            tooltip = "Download PO PR"
            >
            </LinkToFeature>

            <LinkToFeature
                route = "/replaceTemplate"
                imagePath = {fileImport}
                currentRoute = {currentRoute}
                tooltip = "Import template"
            >
            </LinkToFeature>

            <LinkToFeature
                route = "/selectTemplate"
                imagePath = {imageSelect}
                currentRoute = {currentRoute}
            >
            </LinkToFeature>

        </div>
        
    )
}

export default SideNavBar