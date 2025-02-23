import '../Styles.css';
import React, {useState, useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom'
import SideNavBar from './sideNavBar';
import FileUpload from './fileUpload';
import ModeBtn from './modeBtn';
import SelectTemplate from './selectTemplate';

//Figure out how to receive message from main process
const ReplaceTemplate = () => {

    let location = useLocation();
    const [activeStep, setActiveStep] = useState("replaceTemplate");
    const [mode, setMode] = useState('PO');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const logMessage = async () => {
        const result = await window.electronAPI.logMessage()
        return result
    }

    const handleFileChange = (uploadedFile) => {
        setFile(uploadedFile);
    }
    
    const handleDropZoneClick = () => {
        fileInputRef.current.click();
    };

    const handleFileDrop = (uploadedFile) => {
        setFile(uploadedFile);
    }

    
    const parseFile = async (file, templateType) => {
        const result = await window.electronAPI.parseFile(file, templateType);
        console.log(result)
        return result 
    } 
    
    const checkForDuplicate = async (newDataEntry) => {
        const result = await window.electronAPI.checkForDuplicate(newDataEntry)
        return result
    }

    const getUserConfirmation = async (message) => {
        const result = await window.electronAPI.getUserConfirmation(message)
        return result
    }

    const updateDatabase = async (updatedDatabaseObj) => {
        const result = await window.electronAPI.updateDatabase(updatedDatabaseObj)
        return result
    }

    const appendFileToDatabase = async (dataEntry) => {
        const result = await window.electronAPI.appendFileToDatabase(dataEntry);
        return result
    }

    const saveTemplates = async (fileArrayBuffer, filename, templateType) => {
        const result = await window.electronAPI.saveTemplates(fileArrayBuffer, filename, templateType)
        return result
    }


    const handleApplyClick = async (
        parseFile, 
        checkForDuplicate,
        getUserConfirmation,
        updateDatabase, 
        appendFileToDatabase,
        saveTemplates) => {
    
        //handle database operation
        const filename = file.name
        const JSON = await parseFile(filename, mode)
        const duplicate = await checkForDuplicate(JSON)
        const fileArrayBuffer = await file.arrayBuffer();
    
        if (duplicate === null) {
            const appendResult = await appendFileToDatabase(JSON)
            console.log(appendResult)
    
            const saveResult = await saveTemplates(fileArrayBuffer ,filename, mode)
            console.log(saveResult)

            
        } else {
            console.log(duplicate)
            const updateResult = await updateDatabase(duplicate)
            console.log('The updated database is : ', updateResult)
    
            const userConfirmation = await getUserConfirmation(
                'A file with duplicate filename is found, do you wish to replace it? ')
            console.log('userConfirmation is :', userConfirmation)
    
            if (userConfirmation === 'Yes') {
                const saveResult = await saveTemplates(fileArrayBuffer, filename, mode)
                console.log(saveResult)
            } else {
                return
            }          
        }
    }

    useEffect(() => {
        setActiveStep(location.pathname)
        console.log(file)
        const result = logMessage()
        console.log(result)
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
                    <SelectTemplate/>
 
                </div>
            <div className = 'file-upload-function-container'>
                <div className = 'file-upload-function-header-container'>
                    <h4>Upload a new template</h4>
                </div>            
                        <FileUpload
                            file = {file}
                            onFileChange = {handleFileChange}
                            onFileDrop = {handleFileDrop}
                            onDropZoneClick = {handleDropZoneClick}
                            fileInputRef = {fileInputRef}
                        />
                    <h4>Select template Type</h4>
                    <div className = 'template-btn-container'>
                        <ModeBtn 
                            text = "Payment Order"
                            onChange = {() => setMode('PO')}
                            isChecked = {mode === 'PO'}
                        />
                        <ModeBtn 
                            text = "Payment Request"
                            onChange = {() => setMode('PR')}
                            isChecked = {mode === 'PR'}
                        />
                    </div>
                    <div className = 'next-btn-container'>
                        <button 
                            type = 'button' 
                            className = "button"
                            onClick = {() => handleApplyClick(
                                parseFile, 
                                checkForDuplicate,
                                getUserConfirmation,
                                updateDatabase, 
                                appendFileToDatabase,
                                saveTemplates)}
                            
                        >
                        Submit 
                        
                        </button>
                    </div>
               
            </div>
            </div>
        </div>
    )
} 

export default ReplaceTemplate