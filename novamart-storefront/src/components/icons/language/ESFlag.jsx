import React from 'react';

export const ESFlag = ({ ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="h-full"
      {...rest}
    >
      <defs>
        <path id="es-star" fill="#ffde00" d="M-.6.8L0-1 .6.8-1-.3h2z" />
      </defs>
      <path fill="#AA151B" d="M0 0h640v480H0z" />
      <path fill="#F1BF00" d="M0 120h640v240H0z" />
      
      <path
        fill="#ad1519"
        d="M127.3 213.3l-.8-.1-1-1-.7-.4-.6-.8s-.7-1.1-.4-2c.3-.9.9-1.2 1.4-1.5a12 12 0 011.5-.5l1-.4 1.3-.3.5-.3c.2 0 .7 0 1-.2l1-.2 1.6.1h4.8c.4 0 1.2.3 1.4.4a35 35 0 002 .7c.5.1 1.6.3 2.2.6.5.3.9.7 1.1 1l.5 1v1.1l-.5.8-.6 1-.8.6s-.5.5-1 .4c-.4 0-4.8-.8-7.6-.8s-7.3.9-7.3.9"
      />
      <path
        fill="none"
        stroke="#000"
        strokeLinejoin="round"
        strokeWidth=".3"
        d="M127.3 213.3l-.8-.1-1-1-.7-.4-.6-.8s-.7-1.1-.4-2c.3-.9.9-1.2 1.4-1.5a12 12 0 011.5-.5l1-.4 1.3-.3.5-.3c.2 0 .7 0 1-.2l1-.2 1.6.1h4.8c.4 0 1.2.3 1.4.4a35 35 0 002 .7c.5.1 1.6.3 2.2.6.5.3.9.7 1.1 1l.5 1v1.1l-.5.8-.6 1-.8.6s-.5.5-1 .4c-.4 0-4.8-.8-7.6-.8s-7.3.9-7.3.9z"
      />
      
      <use
        width="30"
        height="20"
        transform="matrix(71.9991 0 0 72 120 120)"
        href="#es-star"
      />
      <use
        width="30"
        height="20"
        transform="matrix(-12.33562 -20.5871 20.58684 -12.33577 240.3 48)"
        href="#es-star"
      />
      <use
        width="30"
        height="20"
        transform="matrix(-3.38573 -23.75998 23.75968 -3.38578 288 95.8)"
        href="#es-star"
      />
      <use
        width="30"
        height="20"
        transform="matrix(6.5991 -23.0749 23.0746 6.59919 288 168)"
        href="#es-star"
      />
      <use
        width="30"
        height="20"
        transform="matrix(14.9991 -18.73557 18.73533 14.99929 240 216)"
        href="#es-star"
      />

    </svg>
  );
};
