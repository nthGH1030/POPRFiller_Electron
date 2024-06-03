import React , {useState ,useEffect} from 'react';


import '../Styles.css';

const Navbar = ({activeStep}) => {

    return (
        <nav className = "navbar">
            <div className="navbar-center">
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

export default Navbar