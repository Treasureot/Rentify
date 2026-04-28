import "../Styles/App.css"
import React from 'react';
import { useId } from "react";
import { RiSearchLine } from "react-icons/ri"



type InputProps = {
  label: string;
  type?: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
};



const SearchInput = ({ 
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  name,
  disabled = false,
  required = false,
    }: InputProps) => {
        const id = useId();

    return (
        <>
        <div className="input_group">
            <label htmlFor={id}>{label} {required && <span aria-hidden="true"> *</span>}</label>
            <div className="search_input">
                <div className="input_icon">
                    <RiSearchLine size={16} aria-hidden="true" />
                </div>
                <input
                    type={type} 
                    value={value} 
                    placeholder={placeholder} 
                    onChange={onChange}
                    name={name}
                    disabled={disabled}
                    required={required}
                />    
            </div>
        </div>
        </>
    );
}

export default SearchInput;