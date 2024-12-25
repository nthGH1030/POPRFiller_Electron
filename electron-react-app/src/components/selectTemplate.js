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
        //const templateList = await window.electronAPI.getFileDatabyTemplateType(templateType)
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

        if(templateType === 'PO') {
            return POtemplateList
        } else {
            return PRtemplateList
        }
        //return templateList
    }

    const fetchTemplates = async () => {
        const POList = await getTemplateList('PO')
        const PRList = await getTemplateList('PR')
        setPOList(POList)
        setPRList(PRList)
    };

    const onClickTemplate = (filename) => {
        console.log('you selected the template: ', filename)
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
                    
                    {POList.map((template, index)=> (
                        <Template 
                        key = {index} 
                        filename = {template.filename} 
                        uploadDate = {template.uploadDate}
                        selected = {template.status}
                        onClick = {() => onClickTemplate(template.filename)}
                        />
                    ))}
                </div>
                <div classname = 'flex-container-POPR-selectTemplate'>
                    PR
                </div>
            </div>

        </div>
    )
}

export default SelectTemplate