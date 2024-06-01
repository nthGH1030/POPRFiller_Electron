import '../Styles.css';
import React from 'react';
import { Link } from "react-router-dom";
import Navbar from './NavBar';


function Home() {
    return (
      <div>
        <Navbar/>
        <div className = 'Container'>
          <h1>This is the home page</h1>
          <div className = 'break'></div>
          <button type = 'button' className = "button upload">
              Upload Central File
          </button>
        </div>

        <div className = 'Container'>
          <p>Which row of data you want to extract ?</p>
          <div className = 'break'></div>
          <input type = 'number' min = "1" placeholder = 'Eg. 134'/>
        </div>
        
        <div className = 'Next-Btn-Container'>
          <Link to="/step2">
          <button type = 'button' className = "button">
              Next
          </button>
          </Link>
        </div>
      </div>
    );
  }
  
  export default Home;