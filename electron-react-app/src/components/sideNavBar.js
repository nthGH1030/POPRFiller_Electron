import React from 'react';
import '../Styles.css';
import LinkToFeature from './linkToFeature.js'

const SideNavBar = () => {

    return (
        <div classname = "sideNavBarContainer">
            <LinkToFeature
             route = "/"
             imagePath = ""
            >
             </LinkToFeature>
        </div>
    )
}

export default SideNavBar