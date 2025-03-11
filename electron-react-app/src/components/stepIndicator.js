import React from 'react';
import '../Styles.css';
import step1Icon from '../image/number-1-circle-svgrepo-com.svg';
import step2Icon from '../image/number-circle-two-bold-svgrepo-com.svg';


const StepIndicator = ({activeStep}) => {

    return (
        <div className = "Stepindicator">
            <img alt = 'step1 icon' src = {step1Icon} />

            <div className = 'Stepindicator-instruction'>
                <p>Upload Central Excel</p>
            </div>
            
            <img alt = 'step2 icon' src = {step2Icon} />
            <p>Select template Type</p>

        </div>
        
    )
}

export default StepIndicator