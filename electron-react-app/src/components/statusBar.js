import '../Styles.css';
import React , {useState, useEffect} from 'react';
import iconCheck from '../image/checked.png';
import iconDelete from '../image/delete.png';
import rightArrow from '../image/chevron-right-solid.svg';
import downArrow from '../image/chevron-down-solid.svg';

const StatusBar = ({keyprop, value , status, tips}) => {
    const [tipVisible, setTipVisible] = useState(false);

    const onClick = () => {
        
        setTipVisible(true); 
    }

    return (
        <div className = 'status-bar-container'>
            {status === 'Accepted' ?
                <img alt = 'checkIcon' src = {iconCheck}/>:
                <img alt = 'deleteIcon' src = {iconDelete}/>
            }
            <h5>{keyprop}</h5>
            <p>{value}</p>
            <button className = 'arrow-button' onClick={onClick}>
                <img alt = 'arrow button' src = {rightArrow}/>
            </button>
            {tipVisible && tips[keyprop] && (
                <div className = 'tips-container'>
                    <p>{tips[keyprop]}</p>
                </div>
            )}
        </div>
    )
    
    //make a arrow that expand the bar and show tips
    //The arrow is auto expanded in the case of failure to show error message

    //An loading animation for loading the status bar
}


export default StatusBar