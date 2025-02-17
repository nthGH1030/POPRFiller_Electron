import '../Styles.css';
import React, {useState} from 'react';

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
            {file ? (
                <div className = 'file-drop-zone-container'>
                    <p>File uploaded: {file.name}</p>
                    <span className='span-cursor'>Select a new file</span>
                </div>
                ) : (
                <div className = 'file-drop-zone-container'>
                    <p>Drag and drop the central excel file</p>
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