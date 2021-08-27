import { ButtonBase } from '@material-ui/core';
import React from 'react';
import classNames from 'classnames/bind';
import styles from './SignModule.module.scss';

//인증 버튼을 포함한 input box

const cx = classNames.bind(styles);

const SignAuthInput = ({
    inputType,
    onChange,
    onKeyDown,
    label,
    initValue,
    buttonTitle,
    placeholder,
    name,
    input_disabled = false,
    button_disabled = false,
    noLabel = false,
    onClick = () => {},
    mypage = false,
    reference
}) => {
    return (
        <div className={cx('sign-input')}>
            {!noLabel && <div className={cx('label', { mypage })}>{label}</div>}
            <input
                className={cx({ auth: !mypage, mypage })}
                name={name}
                type={inputType}
                value={initValue}
                placeholder={placeholder}
                onChange={onChange}
                onKeyDown={onKeyDown}
                disabled={input_disabled}
                ref={reference}
            />
            <ButtonBase
                onClick={onClick}
                disabled={button_disabled}
                className={cx('auth-btn', { disabled: button_disabled })}
            >
                {buttonTitle}
            </ButtonBase>
        </div>
    );
};
export default SignAuthInput;
