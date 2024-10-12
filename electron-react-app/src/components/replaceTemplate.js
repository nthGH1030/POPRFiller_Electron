import '../Styles.css';
import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom'
import SideNavBar from './sideNavBar';

const ReplaceTemplate = () => {

    let location = useLocation();
    const [activeStep, setActiveStep] = useState("replaceTemplate");

    useEffect(() => {

        setActiveStep(location.pathname)
        //console.log(activeStep)
    
      },[location.pathname])

    return (
        <div className = 'page'>
            <div className = 'sidebar-container'>
                <SideNavBar currentRoute = {activeStep}>
                </SideNavBar>
            </div>
            <div className = 'replaceTemplate-container'>
                <p>This is where the template should be replaced</p>

            </div>



        </div>
    )
} 

export default ReplaceTemplate