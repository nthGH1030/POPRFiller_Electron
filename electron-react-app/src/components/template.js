import React from "react";
import '../Styles.css';

const Template = ({filename, uploadDate, selected, onClick}) => {
    return (
        
        <div className = {`highlight-if-selected 
            ${selected === 'selected' ? 'selected': ''}`}>
                <span 
                    className = 'file-info' 
                    onClick = {onClick}>
                    {filename}
                    <br />
                    Upload Date: {new Date(uploadDate).toLocaleDateString()}
                </span>
            
            <span className = {`selected-status 
                ${selected === 'selected'? 'selected' : ''}`}>
                {selected}
            </span>
        </div>
    )
}

export default Template