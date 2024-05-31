import React from "react";
import '../Styles.css';

const RadioBtn = ({text}) => {

  const onChange = (e) => {
    const { name } = e.target
    console.log('clicked  ==>', name)
  }

    return (
      <label htmlFor={text} className="radio-label">
        <input
          className="radio-input"
          type="radio"
          name= {text}
          id={text}
          value={text}
          onChange={onChange}
          checked={false}
        />
        <span className ="custom-radio"/>
        {text}
    </label>
    );
  };

export default RadioBtn