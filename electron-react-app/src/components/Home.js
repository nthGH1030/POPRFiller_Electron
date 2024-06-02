import '../Styles.css';
import React, {useState ,useEffect, useRef} from 'react';
import { Link } from "react-router-dom";
import Navbar from './NavBar';



function Home() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleDropZoneClick = () => {
    fileInputRef.current.click();
  };


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

          <div 
            className = {`File-Drop-Zone ${file ? 'has-file' : ''}`}
            onClick={handleDropZoneClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setFile(e.dataTransfer.files[0]);
            }}
          > 
            {file ? (
                  <span>File uploaded: {file.name}</span>
                ) : (
                  <span>Drop your file here</span>
            )}
            <input  
              ref={fileInputRef}
              type = 'file' 
              accept = '.xlsx'
              onChange = {handleFileChange}
            />
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