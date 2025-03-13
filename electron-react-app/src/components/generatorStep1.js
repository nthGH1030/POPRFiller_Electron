import '../Styles.css';
import React, {useState ,useEffect, useRef } from 'react';
import StepIndicator from './stepIndicator';
import {useLocation, useNavigate} from 'react-router-dom';
import SideNavBar from './sideNavBar';
import FileUpload from './fileUpload';
import ModeBtn from "./modeBtn";


function GeneratorStep1() {
  const [file, setFile] = useState(null);
  const [activeStep, setActiveStep] = useState("/");
  const [row, setRow] = useState(null);
  const [type, setTemplateType] = useState('PO');
  const [staff, setStaff] = useState('');
  
  let location = useLocation();
  

  const fileInputRef = useRef(null);

  //handle file upload
  const handleFileChange = (uploadedFile) => {
    setFile(uploadedFile);
  }

  const handleDropZoneClick = () => {
    fileInputRef.current.click();
  };

  const handleFileDrop = (uploadedFile) => {
    setFile(uploadedFile);
  }
  
  //handle row input
  const handleRowChange = (e) => {
    setRow(e.target.value);
  }

  const handleStaff = (e) => {
    localStorage.setItem('staff', e.target.value)
    setStaff(e)
}

  //handle check on necessary input
  const state = {'row': row, 'file' : file, 'type': type, 'staff': staff};

  const handleCheckInput = () => {
    let allFieldFilled = true;

    if (!state.row) {
      alert('Please input the row number');
      allFieldFilled = false;

    } else if (!state.file) {
      alert('Please upload the file');
      allFieldFilled = false;

    } else if (!state.staff) {
      alert('Please enter the name of the staff preparing the submission')
      allFieldFilled = false;
    }
      return allFieldFilled
    }

    //handle nagvigate to next page
    const navigate = useNavigate();
    const handleNextClick= () => {
      if(handleCheckInput())
      {
        navigate('/generatorStep2', {state:state});
      }
    }

    useEffect(() => {

      setActiveStep(location.pathname)
      setStaff(localStorage.getItem('staff'))
      //console.log(activeStep)
      console.log(file)
      //console.log(state)

    },[location.pathname, file, staff])

    return (
      <div className = 'page'>

        <div className = 'sidebar-container'>
          <SideNavBar currentRoute = {activeStep}/>
        </div>

        <div className = 'user-manual-and-generator-container'>
          <div className = 'generatorstep2-stepindicator-container'>
              <StepIndicator  activeStep = {activeStep}/>
          </div>

          <div className = 'user-manuel-container'> 
            <h4>How to use</h4>
            <p>Step 1. Upload a central excel</p>
            <p>2. Input the row number that contains the payment information</p>
            <p>3. Click "Next" button</p>
            <p>4. Follow through Step 2</p>
          </div>

          <div className = 'generatorstep1-container'>
            <h3>Payment Form Generator</h3>
            
            <div className = 'generator-row-container'>
              <FileUpload
                file = {file}
                onFileChange = {handleFileChange}
                onFileDrop = {handleFileDrop}
                onDropZoneClick = {handleDropZoneClick}
                fileInputRef = {fileInputRef}
              />
              <div className = 'row-container'>
                <h5>Row number</h5>
                <input 
                className = 'row-input'
                type = 'number' 
                min = "1" 
                placeholder = 'Eg. 134'
                onChange = {handleRowChange}
                />
              </div>
            </div>
            <div className = 'staff-input-container'>
                <h5>Applicant Name</h5>

                <input type = 'text' className = 'staff-name-input'
                placeholder={localStorage.getItem('staff') ? localStorage.getItem('staff') : 'John Doe, APM-PM'}
                onChange = {handleStaff}/>
            </div>
            <div className = 'template-container'>
                <h5>Select template type</h5>
                <div className = 'template-btn-container'>
                    <ModeBtn 
                        text = "Payment Order"
                        onChange = {() => setTemplateType('PO')}
                        isChecked = {type === 'PO'}
                    />
                    <ModeBtn 
                        text = "Payment Request"
                        onChange = {() => setTemplateType('PR')}
                        isChecked = {type === 'PR'}
                    />
                </div>
            </div>
            <div className = 'next-btn-container'>
              <button 
                type = 'button' 
                className = "button"
                onClick = {handleNextClick}
                >
                  {'Next  >'}
              </button>
            </div>

          </div>
            
        </div>

      </div>
    );
}
  export default GeneratorStep1;