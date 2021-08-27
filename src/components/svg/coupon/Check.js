import React from 'react';

const active_color = '#007246';
const normal_color = '#ccc';

export default function CouponCheck(props) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24">
            <g transform="translate(-48 -423)">
                <path style={{transition: 'stroke .15s cubic-bezier(0.77, 0, 0.175, 1)'}} d="M492.5-1963.33l5.577,8.529,12.355-16" transform="translate(-441 2397.302)" fill="none" stroke={props.select ? active_color : normal_color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <rect width="24" height="24" transform="translate(48 423)" fill="none" />
            </g>
        </svg>
    );
}

CouponCheck.defaultProps = {
    select: true,
};
