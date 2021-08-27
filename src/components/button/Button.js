import React from 'react';
import styles from './Button.module.scss';
import cn from 'classnames/bind';
import { ButtonBase } from '@material-ui/core';
const cx = cn.bind(styles);

const Button = ({ title, disable, onClick, toggle }) => {
    return (
        <ButtonBase
            className={cx('btn', { toggle, disable })}
            onClick={onClick}
            disabled={disable}
            disableRipple={disable}
        >
            {title}
        </ButtonBase>
    );
};

Button.defaultProps = {
    toggle: false,
    disable: false,
    onClick: () => {},
};

export default Button;
