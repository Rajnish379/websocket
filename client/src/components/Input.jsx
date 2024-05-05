import React from "react";

const Input = ({name, placeholder, handleInput }) => {
  return (
    <div>
      <input
        name={name}
        onChange={handleInput}
        className="input-field"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
