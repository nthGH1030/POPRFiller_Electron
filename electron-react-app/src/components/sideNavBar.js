import React, {useState} from 'react';
import '../Styles.css';
import LinkToFeature from './linkToFeature.js'
import fileArrowDown from '../image/file-arrow-down.svg';
import fileArrowUp from '../image/file-arrow-up.svg';



const SideNavBar = ({currentRoute}) => {
    
    return (
        //App icon with name
        // icon + description
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
                imagePath = {fileArrowUp}
                currentRoute = {currentRoute}
                tooltip = "Import template"
            >
            </LinkToFeature>

        </div>
        
    )
}

export default SideNavBar