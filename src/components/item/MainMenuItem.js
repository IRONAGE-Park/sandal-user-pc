import React from 'react';
import styles from './MainMenu.module.scss';
import { DBImageFormat, numberFormat } from '../../lib/formatter';
import { ButtonBase } from '@material-ui/core';
import Noimage from '../svg/noimage.png';
import ErrorCoverImage from '../assets/ErrorCoverImage';

//홈 메뉴 아이템 컴포넌트
const MenuItem = ({ item_name, item_price, item_img, onClick }) => (
    <ButtonBase component='div' className={styles['menu-item']} onClick={onClick}>
        <MenuImg src={item_img !== "[]" ? DBImageFormat(item_img)[0] : Noimage} />
        <div className={styles['pd-box']}>
            <div className={styles['menu-info']}>
                <MenuTitle menuTitle={item_name} />
                <MenuPrice menuPrice={item_price} />
            </div>
        </div>
    </ButtonBase>
);

//홈 메뉴 이미지 컴포넌트
const MenuImg = ({ src }) => (
    <div className={styles['menu-img']}>
        <ErrorCoverImage className={styles['img']} src={src} alt="메뉴 이미지" />
    </div>
);

//홈 메뉴 제목 컴포넌트
const MenuTitle = ({ menuTitle }) => (
    <div className={styles['menu-title']}>{menuTitle}</div>
);

//홈 메뉴 가격 컴포넌트
const MenuPrice = ({ menuPrice }) => (
    <div className={styles['menu-price']}>{numberFormat(menuPrice)}원 부터</div>
);

export default MenuItem;
