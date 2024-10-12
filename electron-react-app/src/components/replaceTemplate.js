import '../Styles.css';
import React, {useState, useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom'
import SideNavBar from './sideNavBar';
import FileUpload from './fileUpload';
import ModeBtn from './modeBtn';

const ReplaceTemplate = () => {

    let location = useLocation();
    const [activeStep, setActiveStep] = useState("replaceTemplate");
    const [mode, setMode] = useState('PO');
    const [file, setFile] = useState(null);
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
    const handleApplyClick = () => {
        const fileName = file.name.toLowerCase();
        
        if (mode === 'PO' && fileName.includes('po')) {
            console.log('template is PO')
        }
        else if (mode === 'PR' && fileName.includes('pr')) {
            console.log('template is PR')
        }
        else if (fileName.includes('po') && fileName.includes('pr') ) {
            alert('Invalid File name, Your template file name must include the word "PO" or "PR" and not both')
        }
        else if (!fileName.includes(mode)) {
            alert('Invalid File name, Your template file name must include the word "PO" or "PR"')
        }
    }
        
    useEffect(() => {

        setActiveStep(location.pathname)
        console.log(file)
        //console.log(activeStep)
    
      },[location.pathname, file])

    return (
        <div className = 'page'>
            <div className = 'sidebar-container'>
                <SideNavBar currentRoute = {activeStep}>
                </SideNavBar>
            </div>
            <div className = 'replaceTemplate-container'>
                <div className = 'existing-template-container'>
                    <p>This div show the existing history of file</p>
                    {/* 
                        1. make a template container that show each history file
                        2. Display metadata about that file in the container
                        3. When user click on a container, it should be highlighted
                        4. Add a button so user can apply the template
                    */}
                </div>
                <h1>Upload a new template</h1>
                <div className = 'file-upload-container'>

                    {/* 
                        1. implement the File Upload feature from the Fileupload component
                        2. Saved the uploaded file in the state
                        3. check whether the template is PO or a PR
                        4. A button to apply 
                        5. make a PO and a PR version of this
                    */}                  
                    <FileUpload
                        file = {file}
                        onFileChange = {handleFileChange}
                        onFileDrop = {handleFileDrop}
                        onDropZoneClick = {handleDropZoneClick}
                        fileInputRef = {fileInputRef}
                    />
                </div>
                <h1>Pick a template Type</h1>
                <div className = 'template-btn-container'>
                    <ModeBtn 
                        text = "PO"
                        onChange = {() => setMode('PO')}
                        isChecked = {mode === 'PO'}
                    />
                    <ModeBtn 
                        text = "PR"
                        onChange = {() => setMode('PR')}
                        isChecked = {mode === 'PR'}
                    />
                </div>
                <div className = 'next-btn-container'>
                    <button 
                        type = 'button' 
                        className = "button"
                        onClick = {handleApplyClick}
                    >
                    Apply
                </button>
                </div>
            </div>



        </div>
    )
} 

export default ReplaceTemplate