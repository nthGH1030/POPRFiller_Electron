import '../Styles.css';
import React, {useState ,useEffect, useRef} from 'react';
import { Link } from "react-router-dom";
import Navbar from './NavBar';
import {useLocation} from 'react-router-dom';



function Home() {
  const [file, setFile] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [row, setRow] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleRowChange = (e) => {
    setRow(e.target.value);
  }

  const handleDropZoneClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    //console.log(file);
  }, [file]);

  let location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveStep("/")
      //console.log(activeStep)
    }
    
  },[location.pathname])

  const state = {'row': row, 'file' : file};


    return (
      <div>
        <Navbar
          activeStep = {activeStep}
        />
        <div className = 'Container'>
          <h1>Upload your file</h1>
          <div className = 'break'></div>

          <div 
            className = {`File-Drop-Zone ${file ? 'has-file' : ''}`}
            onClick={handleDropZoneClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                {
                  setFile(file);
                }
              else
              {
                alert('You can only upload an excel file')
              }
            }}
          > 
            {file ? (
                  <span className='span-cursor'>File uploaded: {file.name}</span>
                ) : (
                  <span className='span-cursor'>Drop your file here</span>
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
          <input 
          type = 'number' 
          min = "1" 
          placeholder = 'Eg. 134'
          onChange = {handleRowChange}
          />
        </div>
        
        <div className = 'Next-Btn-Container'>
          <Link to="/step2" 
          state = {state}
          >
          <button type = 'button' className = "button">
              Next
          </button>
          </Link>
        </div>
      </div>
    );
  }
  
  export default Home;