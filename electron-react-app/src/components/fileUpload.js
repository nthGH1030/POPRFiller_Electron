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
                <span className='span-cursor'>File uploaded: {file.name}</span>
                ) : (
                <span className='span-cursor'>Drop the central excel here</span>
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