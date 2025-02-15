import '../Styles.css';
import React , {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import StepIndicator from "./stepIndicator";
import ModeBtn from "./modeBtn";
import {writePOPR} from '../utils/writeFile';
import { extractDataFromExcel, readExcelFile, readFileUpload } from '../utils/readFile';
import {checkEntity} from '../utils/checkUserExcelInput';
import saveAs from 'file-saver'
import SideNavBar from './sideNavBar';


function GeneratorStep2() {
    const [template, setTemplate] = useState('PO');
    const [activeStep, setActiveStep] = useState('/generatorStep2');
    const [templateContent, setTemplateContent] = useState(null);
    let location = useLocation();
    const {state} = location;
    const {row, file} = state;

    const loadTemplate = async (template) => {
        try {
            let content;
            content = await window.electronAPI.loadTemplate(template);
            console.log("template content: ", content);
            //console.log(localStorage.getItem('staff'));
            setTemplateContent(content);
        } catch (error) {
            console.error('Error loading template:', error);
        }
    };
    
    useEffect(() => {
        setActiveStep("/generatorStep2")
        loadTemplate(template);
    }, [location.pathname, template])
  
    const handleGenerate = async() => {
        if (file) {
            try {
                if(!localStorage.getItem('staff')) {
                    alert('Please enter the name of the staff preparing the submission')
                    return;
                }
                //extract data from uploaded excel file
                const bufferArray = await readFileUpload(file)
                const worksheet = await readExcelFile(bufferArray, 'POPR summary')
                const data = await extractDataFromExcel(worksheet, row);
                console.log(data)

                //Check user input
                const entityWorksheet = await readExcelFile(bufferArray, 'ApprovedEntity')
                const entityValidity = await checkEntity(entityWorksheet, data)
                if(entityValidity.isEntityValid === false) {
                    alert(entityValidity.message)
                    return
                }

                //write the data into respective template
                if (template === 'PO')
                    {
                        const templateWorksheet = await readExcelFile(templateContent, 'PO_Input')
                        const { filename, buffer } = await writePOPR(data, templateWorksheet, template);
                        const blob = new Blob([buffer], { 
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        saveAs(blob, filename);
                    }
                else if (template === 'PR')
                    {
                        const templateWorksheet = await readExcelFile(templateContent, 'PR_Input')
                        const { filename, buffer } = await writePOPR(data, templateWorksheet, template);
                        const blob = new Blob([buffer], { 
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        saveAs(blob, filename);
                    }
                
              } catch (error) {
                console.error('Error:', error);
              }
            } else {
              alert('You must pick a template type to use !');
            }
          };

    const handleStaff = (e) => {
        localStorage.setItem('staff', e.target.value)
    }

    return (
        <>
        <div className = 'page'>
            <div className = 'sidebar-container'>
                <SideNavBar>
                </SideNavBar>
            </div>
            <div className = 'generatorstep-container'>
                <StepIndicator
                    activeStep = {activeStep}
                />
            <div className = 'template-container'>
                <h1>Pick a template</h1>
                <div className = 'break'></div>
                <div className = 'template-btn-container'>
                    <ModeBtn 
                        text = "PO"
                        onChange = {() => setTemplate('PO')}
                        isChecked = {template === 'PO'}
                    />
                    <ModeBtn 
                        text = "PR"
                        onChange = {() => setTemplate('PR')}
                        isChecked = {template === 'PR'}
                    />
                </div>
            </div>
            <div className = 'staff-input-container'>
                <p>Who is preparing this submission?</p>

                <input type = 'text' className = 'staff-name-input'
                placeholder={localStorage.getItem('staff') ? localStorage.getItem('staff') : 'John Doe, APM-PM'}
                onChange = {handleStaff}/>
            </div>
            <div className = 'button-container'>
                <Link to="/">
                    <button type = 'button' className = "button" >
                        Back
                    </button>
                </Link>
                <button type = 'button' className = "button generate" onClick={handleGenerate}>
                    Generate
                </button>
            </div>
            </div>
        </div>
        </>
    );
}



export default GeneratorStep2