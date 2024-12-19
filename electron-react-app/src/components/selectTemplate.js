import '../Styles.css';
import React , {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import SideNavBar from './sideNavBar';

const SelectTemplate = () => {
    let location = useLocation();
    const [activeStep, setActiveStep] = useState("selectTemplate");

    useEffect(() => {
        setActiveStep(location.pathname)
    
      },[location.pathname])

    return(
        <div className = 'page'>
            <div className = 'sidebar-container'>
                <SideNavBar currentRoute = {activeStep}>
                </SideNavBar>
            </div>
            <div className = 'flex-container-selectTemplate'>
                <div className = 'flex-container-selectTemplate'>
                    <p>Select your Template</p>
                </div>
                <div className = 'flex-container-POPR-selectTemplate'>
                    PO
                </div>
                <div className = 'flex-container-POPR-selectTemplate'>
                    PR
                </div>
            </div>

        </div>
    )
}

export default SelectTemplate