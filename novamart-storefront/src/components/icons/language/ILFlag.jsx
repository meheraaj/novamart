import React from 'react';

export const ILFlag = ({ ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="h-full"
      {...rest}
    >
      <path fill="#006a4e" d="M0 0h640v480H0z" />
      <circle cx="288" cy="240" r="160" fill="#f42a41" />
    </svg>
  );
};

export default ILFlag;
