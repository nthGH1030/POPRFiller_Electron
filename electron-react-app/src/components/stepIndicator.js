import React from 'react';
import '../Styles.css';
import step1Icon from '../image/number-1-circle-svgrepo-com.svg';
import step2Icon from '../image/number-circle-two-bold-svgrepo-com.svg';


const StepIndicator = ({activeStep}) => {

    return (
        <div className = "Stepindicator-container">

            {activeStep === '/' ?
                <img alt = 'step1 icon' src = {step1Icon} />:
                <img alt = 'step1 icon' src = {step1Icon} 
                    className = 'Stepindicator-container-img-faded'/>} 
            
                <div className={`stepindicator-description ${activeStep === '/' ? '' : 'faded-filter' }`}>
                    <h5>Upload Excel Table</h5>
                </div> 
            
            {activeStep === '/generatorStep2'? 
                <img alt = 'step2 icon' src = {step2Icon} />:
                <img alt = 'step2 icon' src = {step2Icon} 
                    className = 'Stepindicator-container-img-faded'/>}

             <div className={`stepindicator-description-no-line ${activeStep === '/generatorStep2' ? '' : 'faded-filter' }`}>
                <h5>Download Form</h5>
            </div>
        </div>
        
    )
}

export default StepIndicator