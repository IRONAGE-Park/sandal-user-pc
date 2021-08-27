import React from 'react';

import Noimage from '../svg/noimage.png';

import styles from './Menu.module.scss';
import { numberFormat,DBImageFormat } from "../../lib/formatter";
import ErrorCoverImage from '../assets/ErrorCoverImage';

//홈 메뉴 아이템 컴포넌트
const MenuItem = (props) => {
    return (
        <div className={styles['menu-item']}
            onClick={props.onClick}>
            <MenuImg src={props.item_img} />
            <div className={styles['pd-box']}>
                <div className={styles['menu-info']}>
                    <MenuTitle menuTitle={props.item_name} />
                    <MenuText menuText={props.item_sub} />
                    <MenuPrice menuPrice={props.item_price} />
                </div>
            </div>
        </div>
    );
};

//홈 메뉴 이미지 컴포넌트
function MenuImg({ src }) {
    return (
        <div className={styles['menu-img']}>
            <ErrorCoverImage className={styles['img']} src={src !== "[]" ? DBImageFormat(src)[0] : Noimage} alt={"메뉴 이미지"} />
        </div>
    );
}
//홈 메뉴 제목 컴포넌트
function MenuTitle({ menuTitle }) {
    return (<div className={styles['menu-title']}>{menuTitle}</div>);
}

//홈 메뉴 텍스트 컴포넌트
function MenuText({ menuText }) {
    return (<div className={styles['menu-text']}>{menuText}</div>);
}

//홈 메뉴 가격 컴포넌트
function MenuPrice({ menuPrice }) {
    return <div className={styles['menu-price']}>{numberFormat(menuPrice)}원~</div>;
}

export default MenuItem;
