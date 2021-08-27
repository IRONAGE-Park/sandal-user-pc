import React from 'react';
import PropsTypes from 'prop-types';
import styles from './Cart.module.scss';
import Noimage from '../svg/noimage.png';
import CloseIcon from '../svg/modal/CloseIcon';
import SquareCheckBox from '../../components/checkbox/SquareCheckBox';
import Count from '../../components/svg/counter/Count';
import { IconButton } from '@material-ui/core';
import { DBImageFormat, numberFormat } from '../../lib/formatter';
import { ButtonBase } from '@material-ui/core';
import ErrorCoverImage from '../assets/ErrorCoverImage';

// 메뉴이름, 추가옵션 , 수량 ,가격 ,이미지 ,구매확정

const CartItem = (props) => {
    const { id }  = props;
    const { item_name, item_price, item_quanity, cart_id, item_img } = props.item;
    const { options } = props;

    const total_price = () => {
        let total = parseInt(item_price) * parseInt(item_quanity);
        for (let i = 0; i < options.length; i++) {
            total += parseInt(options[i].option_price) * parseInt(item_quanity);
        }
        return total;
    };

    return (
        <div className={styles['cart-item']}>
            <div className={styles['check-box']}>
                <div className={styles['check']}>
                    <SquareCheckBox
                        check={props.checked}
                        onChange={() => props.handleCheckChild(id)}
                        id={id}
                    />
                </div>
            </div>
            <div className={styles['menu-info']}>
                <div className={styles['menu-img']}>
                    <ErrorCoverImage
                        src={
                            item_img !== '[]'
                                ? DBImageFormat(item_img)[0]
                                : Noimage
                        }
                        alt="menu"
                    />
                </div>
                <div className={styles['menu-value']}>
                    <div className={styles['menu-name-price']}>
                        <div className={styles['m-name']}>{item_name}</div><div className={styles['m-price']}>{numberFormat(total_price())}원</div>
                    </div>
                    <div className={styles['menu-option']}>
                        추가선택:
                        {options.length !== 0
                            ? options.map((op) => op.option_name).join(', ')
                            : ' 없음'}
                    </div>
                    <div className={styles['box']}>
                        <div className={styles['box-item']}>
                            <IconButton
                                className={styles['opert']}
                                onClick={() => props.handleDecrement(id)}
                            >
                                <Count plus={false} />
                            </IconButton>
                            <div className={styles['value']}>
                                {item_quanity}
                            </div>
                            <IconButton
                                className={styles['opert']}
                                onClick={() => props.handleIncrement(id)}
                            >
                                <Count plus={true} />
                            </IconButton>
                        </div>
                        <ButtonBase
                            className={styles['box-item']}
                            onClick={() => props.handleOpen(item_quanity, cart_id)}
                        >
                            수량 변경
                        </ButtonBase>
                    </div>
                </div>
            </div>
            <div className={styles['menu-price']}>
                {numberFormat(total_price())} 원
            </div>
            <div className={styles['close-box']}>
                <CloseIcon black={true} onClick={() => props.handleDelete([cart_id])} />
            </div>
        </div>
    );
};

CartItem.PropsTypes = {
    checked: PropsTypes.bool,
};
CartItem.defaultProps = {
    checked: false,
};

export default React.memo(CartItem);
