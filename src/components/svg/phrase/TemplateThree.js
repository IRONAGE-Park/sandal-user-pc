import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg`
    display: block;
    &, g {
        transition: stroke 0.15s ease-in-out;
    }
`;

export default ({ selected }) => {
    const color = selected ? '#007246' : '#EBEBEB';
    const sub_color = selected ? '#007246' : '#999';
    const border_width = selected ? '2' : '1';
    return (
        <SVG xmlns="http://www.w3.org/2000/svg" width="120" height="120" stroke={color} viewBox="0 0 120 120">
            <g fill="none" transform="translate(-238 -83)">
                <g transform="translate(238 83)" strokeWidth={border_width}>
                    <circle cx="60" cy="60" r="60" stroke="none" />
                    <circle cx="60" cy="60" r="59.5" />
                </g>
                <g stroke={sub_color}>
                    <g transform="translate(298 163) rotate(180)" strokeWidth="1">
                        <rect width="40" height="40" stroke="none" />
                        <rect x="0.5" y="0.5" width="40" height="40" />
                    </g>
                    <g>
                        <line x2="39" transform="translate(343 162) rotate(180)" />
                        <line x2="39" transform="translate(343 143.5) rotate(180)" />
                        <line x2="39" transform="translate(343 124) rotate(180)" />
                        <line x2="39" transform="translate(343 153) rotate(180)" />
                        <line x2="39" transform="translate(343 134) rotate(180)" />
                    </g>
                </g>
            </g>
        </SVG>
    );
};
