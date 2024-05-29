import '../Styles.css';
import React from 'react';
import { Link } from "react-router-dom";
import Nav from "./NavBar";

function Step2() {
    return (
        <>
        <Nav/>
            <h1>Step2</h1>
            <Link to="/">
            <button type = 'button'>
                Back
            </button>
        </Link>

        </>
    );
}

export default Step2