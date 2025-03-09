import '../Styles.css';
import React , {useState, useEffect} from 'react';
import {useNavigate } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import StepIndicator from "./stepIndicator";
import ModeBtn from "./modeBtn";
import {writePOPR} from '../utils/writeFile';
import { extractDataFromExcel, readExcelFile, readFileUpload } from '../utils/readFile';
import {checkEntity, checkDate, checkNumber} from '../utils/checkUserExcelInput';
import saveAs from 'file-saver'
import SideNavBar from './sideNavBar';
import StatusBar from './statusBar';



function GeneratorStep2() {
    const [template, setTemplate] = useState('PO');
    const [activeStep, setActiveStep] = useState('');
    const [templateContent, setTemplateContent] = useState(null);
    const [excelData, setExcelData] = useState({});
    const [tips, setTips] = useState({});
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

    //handle nagvigate back to first page
    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate('/')
    }
    
    useEffect(() => {
        setActiveStep(location.pathname);
        (async() => {
            await loadTemplate(template);
            await getExcelData()
        })();
        
    }, [location.pathname, template])

    useEffect(() => {
        (async() => {
            await generateTips()
        })();
    }, [excelData]) 

    const generateTips = async() => {
        console.time('rendering tips message')
        const tipsMessage = {
            'Entity' : 'The Entity does not match any existing Entity, please check for typos',
            'Delivery date': 'The date must be either a date, N/A or empty',
            'PO Change Request Date' : 'The date must be either a date, N/A or empty',
            'Approved PO amount' : 'The amount must be a number, N/A or empty',
            'PO Change Request' : 'The amount must be a number, N/A or empty',
            'Paid Requested' : 'The amount must be a number, N/A or empty',
            'Total Payment paid' : 'The amount must be a number, N/A or empty'
        }

        const filteredTips = {}
        
        for(const [key, nestedObject] of Object.entries(excelData)) {
            
            if(nestedObject.status === 'Failed') {
                
                filteredTips[key] = tipsMessage[key]
                console.log('filtered tips',filteredTips[key])
            }
        }

        setTips(filteredTips)
        console.timeEnd('rendering tips message')
        console.log('tips is , ' , tips)
    }
    
    const getExcelData = async() => {
        console.time('getExcelData')
        if(file) {
            try {
                //extract data from uploaded excel file
                const bufferArray = await readFileUpload(file)
                const worksheet = await readExcelFile(bufferArray, 'POPR summary')
                const data = await extractDataFromExcel(worksheet, row);

                //Check user input
                const entityWorksheet = await readExcelFile(bufferArray, 'ApprovedEntity')
                const entityValidity =  checkEntity(entityWorksheet, data)
                const checkDeliveryDateValidity = checkDate('Delivery date', data)  
                const checkPORequestDateValidity =  checkDate('PO Change Request Date', data) 
                const checkPaymentValidity =  checkNumber(data)
                
                const validatedResult = {
                    'Entity': entityValidity.isEntityValid,
                    'Delivery date': checkDeliveryDateValidity.isDateValid,
                    'PO Change Request Date': checkPORequestDateValidity.isDateValid,
                    'Approved PO amount': checkPaymentValidity.isPOAmountValid,
                    'PO Change Request': checkPaymentValidity.isPOChangeAmountValid,
                    'Paid Requested': checkPaymentValidity.isPaidReuqestValid,
                    'Total Payment paid': checkPaymentValidity.isTotalPaidValid
                }
                
                const dataWithChecked = {}
                //Check input and append check status
                for (const [key, value] of Object.entries(data)) {

                    if (key === '#Key_Row') {
                        continue
                    }

                    const isValid = validatedResult[key] !== undefined ? validatedResult[key] : true;
                    dataWithChecked[key] = {value, status: isValid? 'Accepted' : "Failed"}

                }

                setExcelData(dataWithChecked);
                console.timeEnd('getExcelData')
                
            } catch(error) {
                console.error('Error:', error);
            }
        }
    }

    const getUserConfirmation = async (message) => {
        const result = await window.electronAPI.getUserConfirmation(message)
        return result
    }

    const handleGenerate = async(getUserConfirmation) => {
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
                
                //if there is a failed data entry, get user confirmation
                for (const [key,value] of Object.entries(excelData)) {
                    if (value.status === 'Failed') {
                        const userConfirmation = await getUserConfirmation(
                            'A data entry has failed, the excel geenrated might not be what you expected,' 
                             ,'do you wishes to continue? ')
                        if(userConfirmation === 'No') {
                            return
                        }
                    } 
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
            <div className = 'generatorstep2-wrapper-container'>
                <div className = 'generatorstep2-container'>
                    {Object.entries(excelData).map(([key,{value, status}]) => (
                        <StatusBar
                            key = {key}   
                            keyprop = {key}
                            value = {value} 
                            status = {status}
                            tips = {tips}
                        />
                     ))}
                </div>

                <div className = 'generatorstep2-container '>
                    <StepIndicator
                        activeStep = {activeStep}
                    />
                    <div className = 'template-container'>
                        <h4>Select template type</h4>
                        <div className = 'template-btn-container'>
                            <ModeBtn 
                                text = "Payment Order"
                                onChange = {() => setTemplate('PO')}
                                isChecked = {template === 'PO'}
                            />
                            <ModeBtn 
                                text = "Payment Request"
                                onChange = {() => setTemplate('PR')}
                                isChecked = {template === 'PR'}
                            />
                        </div>
                    </div>
                    <div className = 'staff-input-container'>
                        <h5>Applicant Name</h5>

                        <input type = 'text' className = 'staff-name-input'
                        placeholder={localStorage.getItem('staff') ? localStorage.getItem('staff') : 'John Doe, APM-PM'}
                        onChange = {handleStaff}/>
                    </div>
                    <div className = 'back-generator-button-container'>
                        
                        <button type = 'button' className = "button button-back" 
                            onClick = {handleBackClick} >
                            {"< Back"}
                        </button>
                        <button type = 'button' className = "button button-generate" 
                            onClick={() => handleGenerate(getUserConfirmation)}>
                            Generate
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}



export default GeneratorStep2