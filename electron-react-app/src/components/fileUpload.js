import '../Styles.css';
import React, {useState} from 'react';
import cloudArrowUp from '../image/cloud-arrow-up.svg';

const FileUpload = ({file, onFileChange, onFileDrop, onDropZoneClick, fileInputRef}) => {


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            onFileChange(file)

        }
        else {
          alert('You can only upload an excel file')
        }
    }

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            onFileDrop(file)

        }
        else {
          alert('You can only upload an excel file')
        }
    }

    const handleDropZoneClick = () => {
        onDropZoneClick();
    }

    return (
        <div
            className = {`File-Drop-Zone ${file ? 'has-file' : ''}`}
            onDragOver = {(e) => e.preventDefault()}
            onDrop = {handleFileDrop}
            onClick = {handleDropZoneClick}
        >   
            <div className = 'image-container'>
                <img src={cloudArrowUp} alt = "file upload icon" 
                    className = 'file-upload-image'/>
            </div>
            {file ? (
                <div className = 'file-drop-zone-container'>
                    <p className = 'file-uploaded-name'>File uploaded: {file.name}</p>
                    <span className='span-cursor'>Select a new file</span>
                </div>
                ) : (
                <div className = 'file-drop-zone-container'>
                    <div className = 'instruction-container'>
                    <span className = 'bold-text'>Drag&Drop</span>
                    <span className = 'normal text'> or </span>
                    <span className = 'bold-text'>Click to select</span>
                    </div>
                    <span className='span-cursor'>Select a file</span>
                </div>
            )}
            <input
                ref = {fileInputRef}
                type = 'file' 
                accept = '.xlsx'
                onChange = {handleFileUpload}
            />
        </div>
    )
}

export default FileUpload