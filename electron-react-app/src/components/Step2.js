import '../Styles.css';
import React , {useState} from 'react';
import { Link } from "react-router-dom";
import Nav from "./NavBar";
import RadioBtn from "./RadioBtn";

function Step2() {
    const [template, setTemplate] = useState('PO');
    
    return (
        <>
        <Nav/>
            <h1>Step2</h1>

        
        <div className = 'template-container'>
            <p>Which template are you going to use?</p>
            <div className = 'break'></div>
            <div className = 'template-btn-container'>
                <RadioBtn 
                    text = "PO"
                    onChange = {() => setTemplate('PO')}
                    isChecked = {template === 'PO'}
                />
                <RadioBtn 
                    text = "PR"
                    onChange = {() => setTemplate('PR')}
                    isChecked = {template === 'PR'}
                />
            </div>
            
        </div>
        
        
        <div className = 'Container'>
            <p>Who is preparing this submission</p>
            <input type = 'text' placeholder = 'John Doe, APM-PM'/>
        </div>
        <div className = 'Button-Container'>
            <Link to="/">
                <button type = 'button' className = "button">
                    Back
                </button>
            </Link>

            <button type = 'button' className = "button generate">
                Generate
            </button>
        </div>

        </>
    );
}



export default Step2