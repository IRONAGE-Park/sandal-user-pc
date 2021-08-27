import React from 'react';

export default ({ color, angle }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="13"
        viewBox="0 0 13 13"
        style={{ transform: 'rotate(' + angle + 'deg)' }}
    >
        <g transform="translate(-250 -442)" stroke={color}>
            <line
                x2="12"
                transform="translate(250.5 448.5)"
                fill="none"
                strokeLinecap="round"
                strokeWidth="1"
            />
            <line
                x2="12"
                transform="translate(256.5 442.5) rotate(90)"
                fill="none"
                strokeLinecap="round"
                strokeWidth="1"
            />
        </g>
    </svg>
);
