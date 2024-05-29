import '../Styles.css';
import React from 'react';
import { Link } from "react-router-dom";


function Home() {
    return (
      <div>
        <h1>This is the home page</h1>
        <Link to="/step2">
            <button type = 'button'>
                Next
            </button>
        </Link>
      </div>
    );
  }
  
  export default Home;