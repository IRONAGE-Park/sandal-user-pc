import React from 'react';
import styles from './Message.module.scss';
import propTypes from 'prop-types';
import { Button } from '@material-ui/core';
import Null_Item from 'components/svg/item/null_item.png';

// 맞춤 주문시 보여줄 컴포넌트
const Message = ({ msg,src, onClick, isButton, buttonName, size = 500 }) => {
    return (
        <div className={styles['msg']} style={{ height: size + 'px' }}>
            {src && (
                <div className={styles['icon']}>
                    <img src={Null_Item} alt={''} />
                </div>
            )}

            <div className={styles['title-msg']}>{msg}</div>
            {isButton && (
                <Button className={styles['custom-btn']} onClick={onClick}>
                    {buttonName}
                </Button>
            )}
        </div>
    );
};

Message.propTypes = {
    msg: propTypes.string,
    onClick: propTypes.func,
    isButton: propTypes.bool,
};

Message.defaultProps = {
    src: true,
    msg: '샌달',
    size: 500,
    isButton: false,
    onClick: () => {},
};

export default Message;
