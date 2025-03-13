import '../Styles.css';
import React , {useState, useEffect} from 'react';
import iconCheck from '../image/checked.png';
import iconDelete from '../image/delete.png';
import rightArrow from '../image/chevron-right-solid.svg';
import downArrow from '../image/chevron-down-solid.svg';

const StatusBar = ({keyprop, value , status, tips}) => {
    const [tipVisible, setTipVisible] = useState(false);
    const [buttonOn, setButtonOn] = useState(false);

    const toggleTips = () => {
        
        tipVisible ? setTipVisible(false): setTipVisible(true);
        buttonOn ? setButtonOn(false): setButtonOn(true)
    }
    
    useEffect(() => {
        if(status === 'Failed') {
            setTipVisible(true)
            setButtonOn(true)
        }
    },[status])
    
    
    return (
        <div className = 'status-bar-tips-container'>
            <div className = 'status-bar-container'>
                {status === 'Accepted' ?
                    <img alt = 'checkIcon' src = {iconCheck}/>:
                    <img alt = 'deleteIcon' src = {iconDelete}/>
                }
                <h5>{keyprop}</h5>
                <p>{value}</p>

                <button className = 'arrow-button' onClick={toggleTips}>
                    
                    {buttonOn ?
                        <img alt = 'arrow button' src = {downArrow}/>:
                        <img alt = 'arrow button' src = {rightArrow}/>
                    }
                </button>

            </div>
                {tipVisible && tips[keyprop] && (
                    <div className = 'tips-container'>
                        <h5>Invalid Input</h5>
                        <p> {tips[keyprop]}</p>
                    </div>
                )}
        </div>
)
    
}


export default StatusBar