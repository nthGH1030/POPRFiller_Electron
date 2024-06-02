import '../Styles.css';
import React, {useState ,useEffect} from 'react';
import { Link } from "react-router-dom";
import Navbar from './NavBar';



function Home() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    console.log(file);
    const div = document.getElementsByClassName('File-Drop-Zone');
    console.log(div);

  }, [file]);

    return (
      <div>
        <Navbar/>
        <div className = 'Container'>
          <h1>Upload your file</h1>
          <div className = 'break'></div>

          <div className = {`File-Drop-Zone ${file ? 'has-file' : ''}`}> 
            <label htmlFor="file-upload" className="custom-file-upload">
              Drop  your File here
              <input  
                id = 'file-upload'
                type = 'file' 
                accept = '.xlsx'
                onChange = {handleFileChange}
              />
            </label>
          </div>
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