import '../Styles.css';
import React from 'react';
import { Link } from "react-router-dom";
import Nav from "./NavBar";
import ToogleSwitch from "./ToogleSwitch";

function Step2() {
    return (
        <>
        <Nav/>
            <h1>Step2</h1>

        <p>Which template are you going to use?</p>
        <ToogleSwitch label = "Templates"/>
        

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