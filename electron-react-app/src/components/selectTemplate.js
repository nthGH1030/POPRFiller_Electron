import '../Styles.css';
import React , {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import SideNavBar from './sideNavBar';
import Template from './template';

const SelectTemplate = () => {
    let location = useLocation();
    const [activeStep, setActiveStep] = useState("selectTemplate");
    const [POList, setPOList] = useState([]);
    const [PRList, setPRList] = useState([]);

    
    const getTemplateList = async (templateType) => {
        const templateList = await window.electronAPI.getFileDatabyTemplateType(templateType)
        /*
        const POtemplateList = [{
            filename: 'POtemplate1',
            uploadDate: Date.now(),
            templateType: 'PO',
            status: "unselected"
        },
        {
            filename: 'POtemplate2',
            uploadDate: Date.now(),
            templateType: 'PO',
            status: "selected"
        }
        ]
        const PRtemplateList = [{
            filename: 'PRtemplate1',
            uploadDate: Date.now(),
            templateType: 'PR',
            status: "unselected"
        },
        {
            filename: 'PRtemplate2',
            uploadDate: Date.now(),
            templateType: 'PR',
            status: "selected"
        }
        ]
        */
        /*
        if(templateType === 'PO') {
            return templateList
        } else {
            return PRtemplateList
        }
        */
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
        <div className = 'page'>
            <div className = 'sidebar-container'>
                <SideNavBar currentRoute = {activeStep}>
                </SideNavBar>
            </div>
            <div className = 'flex-container-selectTemplate'>
                <div className = 'flex-container-selectTemplate'>
                    <h1>Select your Template</h1>
                </div>
                <div className = 'flex-container-POPR-selectTemplate'>
                    <h3>PO</h3>
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
                <div className = 'flex-container-POPR-selectTemplate'>
                    <h3>PR</h3>
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

        </div>
    )
}

export default SelectTemplate