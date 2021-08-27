import React from 'react';

export default function Check({ on }) {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32">
            <g transform="translate(-720 -1279)">
                <circle
                    cx="16"
                    cy="16"
                    r="16"
                    transform="translate(720 1279)"
                    style={{ transition: "fill .2s ease-in-out" }}
                    fill={on ? '#007246' : '#dbdbdb'}
                />
                <path
                    d="M-2253.518-19278.807l4.73,4.537,9.305-10.486"
                    transform="translate(2982.018 20574.256)"
                    fill="none"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                />
            </g>
        </svg>
    );
}
