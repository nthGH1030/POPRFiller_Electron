import '../Styles.css';
import React , {useState, useEffect} from 'react';
import iconCheck from '../image/checked.png';
import iconDelete from '../image/delete.png';

const StatusBar = ({keyprop, value , status, tips}) => {
    
    return (
        <div className = 'status-bar-container'>
            {status === 'Accepted' ?
                <img alt = 'checkIcon' src = {iconCheck}/>:
                <img alt = 'deleteIcon' src = {iconDelete}/>
            }
            
            <h4>{keyprop}</h4>
            <p>{value}</p>
            <p>{status}</p>
        </div>
    )
    
    //make a tick and cross icon
    //make a container to house the key
    //make a container to house the value
    //make a arrow that expand the bar and show tips
    //The arrow is auto expanded in the case of failure to show error message

    //An loading animation for loading the status bar
}


export default StatusBar