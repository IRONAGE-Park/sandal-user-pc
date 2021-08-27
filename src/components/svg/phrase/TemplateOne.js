import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg`
    display: block;
    &, g {
        transition: stroke 0.15s ease-in-out;
    }
`;

export default ({ selected }) => {
    const color = selected ? "#007246" : "#EBEBEB";
    const sub_color = selected ? "#007246" : "#999";
    const border_width = selected ? "2" : "1";
    return (
        <SVG xmlns="http://www.w3.org/2000/svg" width="120" height="120" stroke={color} viewBox="0 0 120 120">
            <g fill="none" transform="translate(-24 -176)">
                <g transform="translate(24 176)" strokeWidth={border_width}>
                    <circle cx="60" cy="60" r="60" stroke="none" />
                    <circle cx="60" cy="60" r="59" />
                </g>
                <g stroke={sub_color}>
                    <g transform="translate(56 208)" strokeWidth="1">
                        <rect width="56" height="32" stroke="none" />
                        <rect x="0.5" y="0.5" width="55" height="31" />
                    </g>
                    <g>
                        <line x2="56" transform="translate(56 248)" strokeWidth="1"/>
                        <line x2="56" transform="translate(56 256)" strokeWidth="1"/>
                        <line x2="56" transform="translate(56 264)" strokeWidth="1"/>
                    </g>
                </g>
            </g>
        </SVG>
    );
};
