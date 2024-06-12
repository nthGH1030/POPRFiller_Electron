import '../Styles.css';
import React , {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Nav from "./NavBar";
import RadioBtn from "./RadioBtn";
import {useLocation} from 'react-router-dom';
import {Generate, handlePO} from '../POPRFiller';
import templatePO from '../secrets/template PO.xlsx' 
import saveAs from 'file-saver'

function Step2() {
    const [template, setTemplate] = useState('PO');
    
    const [activeStep, setActiveStep] = useState(null);

    let location = useLocation();
    const {state} = location;
    const {row, file} = state;
    
    useEffect(() => {
      if (location.pathname === '/step2') {
        setActiveStep("/step2")
        //console.log(location)
        //console.log(row)
        console.log(template)
      }  
    },[location.pathname])
  
    const handleClick = async() => {
        if (file) {
            try {
                const data = await Generate(file, row);
                console.log(data)
                if (template === 'PO')
                    {
                        const { filename, buffer } = await handlePO(templatePO, data);
                        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        saveAs(blob, filename);
                    }
                
              } catch (error) {
                console.error('Error:', error);
              }
            } else {
              console.error('File is undefined');
            }
          };

    return (
        <>
        <p>Row: {row}</p>
        <p>File: {file?.name}</p>
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
            <p>Who is preparing this submission</p>
            <input type = 'text' placeholder = 'John Doe, APM-PM'/>
        </div>
        <div className = 'Button-Container'>
            <Link to="/">
                <button type = 'button' className = "button">
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