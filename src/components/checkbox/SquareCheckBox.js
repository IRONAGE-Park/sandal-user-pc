import React from 'react';
import styles from './SquareBox.module.scss';
import cn from 'classnames/bind';

const cx = cn.bind(styles);

export default function SquareCheckBox({ id, text, check, onChange }) {
    return (
        <div className={cx('check', 'item')}>
            <div className={cx('sub-text')}>
                <input
                    type="checkbox"
                    id={id}
                    checked={check}
                    onChange={onChange}
                />
                <label className={styles['label']} htmlFor={id}>
                    <SquareBox on={check} />
                    {text}
                </label>
            </div>
        </div>
    );
}

function SquareBox({ on }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20">
            <g transform="translate(-360 -788)">
                <g
                    transform="translate(360 788)"
                    fill="#fff"
                    stroke="#ccc"
                    strokeWidth="2"
                >
                    <rect width="20" height="20" stroke="none" />
                    <rect x="0.5" y="0.5" width="19" height="19" fill="none" />
                </g>
                {on && (
                    <path
                        d="M-17822.176-1523.223l5.059,5.712,7.98-12.21"
                        transform="translate(18186 2321)"
                        fill="none"
                        stroke="#555"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}
            </g>
        </svg>
    );
}
