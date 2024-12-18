import React from "react";
import '../Styles.css';

const Template = ({filename, uploadDate, selected, onClick}) => {
    return (
        <div classname = 'template-container'>
            <div className = {`highlight-if-selected ${selected ? 'selected ': ''}`}>
                <span 
                    classname = 'file-info' 
                    onClick = {onClick}>
                    {filename}
                    <br />
                    {new Date(uploadDate).toLocaleDateString()}
                </span>
            </div>
            <span classname = 'selected-status'>
                {selected}
            </span>
        </div>
    )
}

export default Template