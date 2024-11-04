import '../Styles.css';
import React, {useState, useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom'
import SideNavBar from './sideNavBar';
import FileUpload from './fileUpload';
import ModeBtn from './modeBtn';

//Figure out how to receive message from main process
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
    const handleApplyClick = async (
        file, 
        mode, 
        parseFile, 
        ensureDatabaseExist, 
        appendFileToDatabase, 
        saveTemplates) => {

        await ensureDatabaseExist()
        const JSON = await parseFile(file, mode)
        
        if (mode === 'PO') {
            console.log('template is PO')
            await appendFileToDatabase(JSON)
            await saveTemplates(file)
        }
        else if (mode === 'PR') {
            console.log('template is PR')
        }
    }

    const appendFileToDatabase = async (dataEntry) => {
        const message = await window.electronAPI.appendFileToDatabase(dataEntry);
        alert(message)
    }

    const ensureDatabaseExist = async () => {
        await window.electronAPI.ensureDatabaseExist()
    }

    const saveTemplates = async (fileArrayBuffer) => {
        await window.electronAPI.saveTemplates(fileArrayBuffer)
    }

    const parseFile = async (file, templateType) => {
        await window.electronAPI.parseFile(file, templateType)
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
                        onClick = {() => handleApplyClick(
                            file, 
                            mode, 
                            parseFile, 
                            ensureDatabaseExist, 
                            appendFileToDatabase, 
                            saveTemplates)}
                    >
                    Apply
                </button>
                </div>
            </div>



        </div>
    )
} 

export default ReplaceTemplate