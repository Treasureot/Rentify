import "../Styles/App.css"
import React from 'react';


type InputProps = {
    label: string;
    type?: string;
    value: string;
    required?: boolean;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


const Input = (
    { label, 
      type ="text",
      value,
      placeholder,
      required = false,
      onChange
    }: InputProps) => {

    return (
        <>
        <div className="input_group">
            <label>{label} {required && <span style={{color: 'red'}}>*</span>}</label>
            <input type={type} value={value} placeholder={placeholder} onChange={onChange} />
        </div>
        </>
    );
}

export default Input;