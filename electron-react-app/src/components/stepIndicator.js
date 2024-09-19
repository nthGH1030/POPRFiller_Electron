import React from 'react';


import '../Styles.css';

const StepIndicator = ({activeStep}) => {

    return (
        <nav className = "StepIndicator">
            <div className="StepIndicator-center">
                <ul className = "nav-ul">
                    <li  
                        className={`nav-il ${activeStep === '/' ? 'active' : ''}`}
                    >
                        Step 1
                    </li>
                    <li 
                        className={`nav-il ${activeStep === '/step2' ? 'active' : ''}`}
                    >
                        Step 2
                    </li>
                </ul>
            </div>

        </nav>
        
    )
}

export default StepIndicator