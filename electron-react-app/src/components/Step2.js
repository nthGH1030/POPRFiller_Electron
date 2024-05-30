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

        
        <div className = 'select-theme'>
            <p>Which template are you going to use?</p>
            <RadioBtn text = "PO"/>
            <RadioBtn text = "PR"/>
        </div>
        
        

        <p>Who is preparing this submission</p>
        <input type = 'text' placeholder = 'John Doe, APM-PM'/>

        <Link to="/">
            <button type = 'button' className = "button">
                Back
            </button>
        </Link>

        <button type = 'button' className = "button generate">
            Generate
        </button>

        </>
    );
}



export default Step2