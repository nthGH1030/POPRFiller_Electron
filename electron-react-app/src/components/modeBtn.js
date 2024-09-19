import React from "react";
import '../Styles.css';

const ModeBtn = ({text, onChange , isChecked}) => {
    
    if(text === 'PO')
    {
      //console.log("PO: " + isChecked)
    }
    else {
      //console.log("PR: " + isChecked)
    }
    

    return (
      <label htmlFor={text} className={`mode-label ${isChecked ? 'checked':''}`}>
        <input
          className="mode-input"
          type="radio"
          name= {text}
          id={text}
          value={text}
          onChange={onChange}
          checked={isChecked}
        />
        <span className ="custom-mode"/>
        {text}
    </label>
    );
  };

export default ModeBtn