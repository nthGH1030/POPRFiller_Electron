import '../Styles.css';
import React , {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Nav from "./NavBar";
import RadioBtn from "./RadioBtn";
import {useLocation} from 'react-router-dom';
import {handlePO, handlePR} from '../utils/WriteFile';
import {extractDataFromExcel} from '../utils/ReadFile';
import saveAs from 'file-saver'

function Step2() {
    const [template, setTemplate] = useState('PO');
    const [activeStep, setActiveStep] = useState('/step2');
    const [templateContent, setTemplateContent] = useState(null);

    let location = useLocation();
    const {state} = location;
    const {row, file} = state;

    const loadTemplate = async () => {
        try {
            let content;
            if (template === 'PO') {
                content = await window.electronAPI.loadTemplatePO();
            } else {
                content = await window.electronAPI.loadTemplatePR();
            }
            console.log(content);
            console.log(localStorage.getItem('staff'));
            setTemplateContent(content);
        } catch (error) {
            console.error('Error loading template:', error);
        }
    };
    
    useEffect(() => {
        
        setActiveStep("/step2")
        loadTemplate();
        
    }, [location.pathname, template])
  
    const handleClick = async() => {
        if (file) {
            try {
                const data = await extractDataFromExcel(file, row);
                console.log(data)
                if(localStorage.getItem('staff') == null) {
                    alert('Please enter the name of the staff preparing the submission')
                    return;
                }
                if (template === 'PO')
                    {
                        const { filename, buffer } = await handlePO(templateContent, data);
                        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        saveAs(blob, filename);
                    }
                if (template === 'PR')
                    {
                        const { filename, buffer } = await handlePR(templateContent, data);
                        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        saveAs(blob, filename);
                    }
                
              } catch (error) {
                console.error('Error:', error);
              }
            } else {
              alert('You have not uploaded the file ! Go Back to Step 1');
            }
          };

    const handleStaff = (e) => {
        localStorage.setItem('staff', e.target.value)
    }

    return (
        <>
        <Nav
            activeStep = {activeStep}
        />
        
        <div className = 'template-container'>
            <h1>Pick a template</h1>
            <div className = 'break'></div>
            <div className = 'template-btn-container'>
                <RadioBtn 
                    text = "PO"
                    onChange = {() => setTemplate('PO')}
                    isChecked = {template === 'PO'}
                />
                <RadioBtn 
                    text = "PR"
                    onChange = {() => setTemplate('PR')}
                    isChecked = {template === 'PR'}
                />
            </div>
            
        </div>
        
        <div className = 'Container'>
            <p>Who is preparing this submission?</p>
            <input type = 'text' 
            placeholder={localStorage.getItem('staff') ? localStorage.getItem('staff') : 'John Doe, APM-PM'}
            onChange = {handleStaff}/>
        </div>
        <div className = 'Button-Container'>
            <Link to="/">
                <button type = 'button' className = "button" >
                    Back
                </button>
            </Link>

            <button type = 'button' className = "button generate" onClick={handleClick}>
                Generate
            </button>
        </div>

        </>
    );
}



export default Step2