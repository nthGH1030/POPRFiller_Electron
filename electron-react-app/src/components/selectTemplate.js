import '../Styles.css';
import React , {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import Template from './template';

const SelectTemplate = () => {
    let location = useLocation();
    const [activeStep, setActiveStep] = useState("selectTemplate");
    const [POList, setPOList] = useState([]);
    const [PRList, setPRList] = useState([]);

    const getTemplateList = async (templateType) => {
        const templateList = await window.electronAPI.getFileDatabyTemplateType(templateType)

        return templateList
    }
    
    const fetchTemplates = async () => {
        const POList = await getTemplateList('PO')
        const PRList = await getTemplateList('PR')
        setPOList(POList)
        setPRList(PRList)
        console.log ('POList is: ', POList)
        console.log ('PRList is: ', PRList)
    };

    const onClickTemplate = async (filename, templateType) => {
        //update the template data in database
        console.log('you selected the template: ', filename)
        const result = await window.electronAPI.selectAndDeselectTemplate(filename, templateType)
        console.log('the selection of template is : ', result)
        //re-fetch the template data
        const POList = await getTemplateList('PO')
        const PRList = await getTemplateList('PR')
        setPOList(POList)
        setPRList(PRList)
    }

    useEffect(() => {
        setActiveStep(location.pathname)
        fetchTemplates();
      },[location.pathname])

    return(
        <>
            <div className = 'flex-container-selectTemplate'>
                <div className = 'flex-container-template-type-header'>
                    <h4>Template History</h4>
                </div>
                <div className = 'flex-container-template-type-header-h5' >
                    <h5>Payment Order </h5>
                </div>
                
                <div className = 'flex-container-POPR-selectTemplate'>
                    {POList.map((template, index)=> (
                        <Template 
                        key = {index} 
                        filename = {template.filename} 
                        uploadDate = {template.uploadDate}
                        selected = {template.status}
                        onClick = {() => onClickTemplate(template.filename, 'PO')}
                        />
                    ))}
                </div>
                
                <div className = 'flex-container-template-type-header-h5' >
                        <h5>Payment Request</h5>
                </div>
                
                <div className = 'flex-container-POPR-selectTemplate'>
                    
                    {PRList.map((template, index)=> (
                            <Template 
                            key = {index} 
                            filename = {template.filename} 
                            uploadDate = {template.uploadDate}
                            selected = {template.status}
                            onClick = {() => onClickTemplate(template.filename, 'PR')}
                            />
                    ))}
                </div>
                
            </div>

        </>
    )
}

export default SelectTemplate