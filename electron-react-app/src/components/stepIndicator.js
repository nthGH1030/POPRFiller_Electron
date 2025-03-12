import React from 'react';
import '../Styles.css';
import step1Icon from '../image/number-1-circle-svgrepo-com.svg';
import step2Icon from '../image/number-circle-two-bold-svgrepo-com.svg';


const StepIndicator = ({activeStep}) => {

    return (
        <div className = "Stepindicator-container">

            <img alt = 'step1 icon' src = {step1Icon} />
            <div className = 'stepindicator-description'>
                <h4>Upload Central Excel</h4>
            </div>
            <img alt = 'step2 icon' src = {step2Icon} />
            <div className = 'stepindicator-description-no-line'>
                <h4>Select template Type</h4>
            </div>
        </div>
        
    )
}

export default StepIndicator