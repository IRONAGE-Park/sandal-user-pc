import React from 'react';

//추가 주문 아이템 셀렉트 박스

const Select = ({ check }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ cursor: 'pointer' }}
        >
            <g transform="translate(-753 -827)">
                <g
                    transform="translate(753 827)"
                    fill="#fff"
                    stroke="#dbdbdb"
                    strokeWidth="1"
                >
                    <circle cx="12" cy="12" r="12" stroke="none" />
                    <circle cx="12" cy="12" r="11.5" fill="none" />
                </g>
                <circle
                    cx="8" cy="8" r="8"
                    transform="translate(757 831)"
                    fill={check ? "#007246" : "#fff"}
                    style={{ transition: 'fill .2s ease-in-out' }}
                />
            </g>
        </svg>
    );
};

export default Select;
