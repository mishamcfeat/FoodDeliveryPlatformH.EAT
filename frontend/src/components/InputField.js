import React from 'react';

function InputField({ placeholder, onChange }) {
  return (
    <input type="text" placeholder={placeholder} onChange={onChange} />
  );
}

export default InputField;
