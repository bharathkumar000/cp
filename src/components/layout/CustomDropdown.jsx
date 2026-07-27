import React from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ options = [], value, onChange, placeholder = "Select option", label }) => {
    return (
        <div className="custom-dropdown-container">
            {label && <label className="dropdown-field-label">{label}</label>}
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="lms-input-select"
            >
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {options.map((option, index) => {
                    const optLabel = typeof option === 'string' ? option : option.label;
                    const optValue = typeof option === 'string' ? option : option.value;
                    return (
                        <option key={index} value={optValue}>
                            {optLabel}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default CustomDropdown;
