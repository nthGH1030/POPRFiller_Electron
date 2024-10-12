import '../Styles.css';
import React, {useState ,useEffect, useRef } from 'react';
import StepIndicator from './stepIndicator';
import {useLocation, useNavigate} from 'react-router-dom';
import SideNavBar from './sideNavBar';
import FileUpload from './fileUpload';


function GeneratorStep1() {
  const [file, setFile] = useState(null);
  const [activeStep, setActiveStep] = useState("/");
  const [row, setRow] = useState(null);
  let location = useLocation();

  const fileInputRef = useRef(null);

  const handleFileChange = (uploadedFile) => {
    setFile(uploadedFile);
  }

  const handleDropZoneClick = () => {
    fileInputRef.current.click();
  };

  const handleFileDrop = (uploadedFile) => {
    setFile(uploadedFile);
  }

  const handleRowChange = (e) => {
    setRow(e.target.value);
  }

  useEffect(() => {

    setActiveStep(location.pathname)
    //console.log(activeStep)
    console.log(file)
    //console.log(state)

  },[location.pathname, file])

  const state = {'row': row, 'file' : file};

  const handleCheckInput = () => {
    let allFieldFilled = true;
    if (!state.row) {
      alert('Please input the row number');
      allFieldFilled = false;
    }
    else if (!state.file) {
      alert('Please upload the file');
      allFieldFilled = false;
    }
      return allFieldFilled
    }

    const navigate = useNavigate();
    const handleNextClick= () => {
      if(handleCheckInput())
      {
        navigate('/generatorStep2', {state:state});
      }
  }
    return (
      <div className = 'page'>
        <div className = 'sidebar-container'>
          <SideNavBar currentRoute = {activeStep}/>
        </div>

        <div className = 'generatorstep-container'>
          <StepIndicator
            activeStep = {activeStep}
          />
        <div className = 'row-container'>

          <h1>Upload your file</h1>
          <div className = 'break'>
          </div>
          <div>
            <FileUpload
              file = {file}
              onFileChange = {handleFileChange}
              onFileDrop = {handleFileDrop}
              onDropZoneClick = {handleDropZoneClick}
              fileInputRef = {fileInputRef}
            />
          </div>
        </div>

        <div className = 'row-container'>
          <p>Which row of data you want to extract ?</p>
          <div className = 'break'></div>
          <input 
          className = 'row-input'
          type = 'number' 
          min = "1" 
          placeholder = 'Eg. 134'
          onChange = {handleRowChange}
          />
        </div>
        
        <div className = 'next-btn-container'>
          <button 
            type = 'button' 
            className = "button"
            onClick = {handleNextClick}
            >
              Next
          </button>
        </div>
        </div>
        
      </div>
    );
}
  export default GeneratorStep1;