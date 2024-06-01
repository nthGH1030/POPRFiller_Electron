import React from "react";
import '../Styles.css';

const RadioBtn = ({text, onChange , isChecked}) => {
    
    if(text === 'PO')
    {
      console.log("PO: " + isChecked)
    }
    else {
      console.log("PR: " + isChecked)
    }
    

    return (
      <label htmlFor={text} className={`radio-label ${isChecked ? 'checked':''}`}>
        <input
          className="radio-input"
          type="radio"
          name= {text}
          id={text}
          value={text}
          onChange={onChange}
          checked={isChecked}
        />
        <span className ="custom-radio"/>
        {text}
    </label>
    );
  };

export default RadioBtn