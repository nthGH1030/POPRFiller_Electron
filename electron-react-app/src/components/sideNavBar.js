import React, {useState} from 'react';
import '../Styles.css';
import LinkToFeature from './linkToFeature.js'
import fileArrowDown from '../image/file-arrow-down.svg';
import fileArrowUp from '../image/file-arrow-up.svg';
import appIcon from '../image/App-icon.png';



const SideNavBar = ({currentRoute}) => {
    
    return (
        //App icon with name
        // icon + description
        <div className = 'sidebar-container'>
            <img
                alt = 'App Icon'
                src = {appIcon}
            />
            <LinkToFeature
                route = "/"
                imagePath = {fileArrowDown }
                currentRoute = {currentRoute}
                tooltip = "Generate PO or PR"
                title = 'Generator'
            >
            </LinkToFeature>

            <LinkToFeature
                route = "/replaceTemplate"
                imagePath = {fileArrowUp}
                currentRoute = {currentRoute}
                tooltip = "Import new template"
                title = 'My Templates'
            >
            </LinkToFeature>

        </div>
        
    )
}

export default SideNavBar