import React from 'react';
import styles from './SignModule.module.scss';

//인증 버튼을 포함하지 않을 input

const SignNormalInput = ({
    inputType,
    label,
    onChange,
    onKeyDown,
    initValue,
    placeholder,
    name,
    reference
}) => {
    return (
        <div className={styles['sign-input']}>
            <div className={styles['label']}>{label}</div>
            <input
                className={styles['normal']}
                name={name}
                placeholder={placeholder}
                type={inputType}
                value={initValue}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={reference}
            />
        </div>
    );
};

export default SignNormalInput;
