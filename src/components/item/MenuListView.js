import React from 'react';
import styles from './MenuList.module.scss';
import MainMenuItem from './MainMenuItem';
import ListView from '../assets/ListView';

// 슬릭추가
const MeunListView = ({ menuList, onClick }) => {
    const list = menuList.map((menu) => (
        <MainMenuItem
            key={menu.item_id}
            item_name={menu.item_name}
            item_price={menu.item_price}
            item_img={menu.item_img}
            ca_id={menu.ca_id}
            src={menu.item_img}
            onClick={() => onClick(menu.item_id)}
        />
    ));
    return (
        <div className={styles['container']}>
            <ListView listLength={list.length}>
                {list}
            </ListView>
        </div>
    );
};

export default MeunListView;
