import '../Styles.css';
import React from 'react';
import SideNavBar from './sideNavBar';

const ReplaceTemplate = () => {

    return (
        <div className = 'page'>
            <div className = 'sidebar-container'>
                <SideNavBar>
                </SideNavBar>
            </div>
            <div className = 'replaceTemplate-container'>
                <p>This is where the template should be replaced</p>

            </div>



        </div>
    )
} 

export default ReplaceTemplate