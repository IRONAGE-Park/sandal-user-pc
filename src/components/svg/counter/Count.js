import React from 'react';

export default function Count({ plus }) {
    return (
        <svg width="13" height="13" viewBox="0 0 13 13">
            <g transform="translate(-1095.5 -796)">
                <line
                    x2="12"
                    transform="translate(1096 802.5)"
                    fill="none"
                    stroke="#222"
                    strokeLinecap="round"
                    strokeWidth="1"
                />
                {plus && (
                    <line
                        y2="12"
                        transform="translate(1102 796.5)"
                        fill="none"
                        stroke="#222"
                        strokeLinecap="round"
                        strokeWidth="1"
                    />
                )}
            </g>
        </svg>
    );
}

Count.defaultProps = {
    plus: false,
};
