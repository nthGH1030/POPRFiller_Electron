import '../Styles.css';
import React from 'react';
import { Link } from "react-router-dom";
import Navbar from './NavBar';


function Home() {
    return (
      <div>
        <Navbar/>
        <h1>This is the home page</h1>

        <button type = 'button' className = "button upload">
            Upload Central File
        </button>

        <p>Which row of data you want to extract ?</p>

        <input type = 'number' min = "1" placeholder = 'Eg. 134'/>
        
        <Link to="/step2">
        <button type = 'button' className = "button">
            Next
        </button>
        </Link>
      </div>
    );
  }
  
  export default Home;