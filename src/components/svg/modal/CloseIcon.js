import { IconButton } from '@material-ui/core';
import React from 'react';

export default function CloseIcon({ black, onClick }) {
    return (
        <IconButton onClick={onClick}>
            <svg width="32" height="32" viewBox="0 0 32 32">
                <g transform="translate(17323 9370)">
                    <g transform="translate(-17134.324 -10780.092) rotate(45)">
                        <line
                            y2="20"
                            transform="translate(886.5 1120.5)"
                            fill="none"
                            stroke={black ? '#000' : '#fff'}
                            strokeLinecap="round"
                            strokeWidth="2"
                        />
                        <line
                            y2="20"
                            transform="translate(896.5 1130.5) rotate(90)"
                            fill="none"
                            stroke={black ? '#000' : '#fff'}
                            strokeLinecap="round"
                            strokeWidth="2"
                        />
                    </g>
                    <rect
                        width="32"
                        height="32"
                        transform="translate(-17323 -9370)"
                        fill="none"
                    />
                </g>
            </svg>
        </IconButton>
    );
}

CloseIcon.defaultProps = {
    black: false,
};
