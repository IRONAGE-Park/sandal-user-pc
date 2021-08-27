import React from 'react';
import styles from './Menu.module.scss';
import MenuItem from './MenuItem';

const MenuItemList = ({ menuList, onClick }) => {
    const list = menuList.map((menu, index) => (
        <MenuItem
            index={index}
            ca_id={menu.ca_id}
            created_at={menu.created_at}
            deleted={menu.deleted}
            item_id={menu.item_id}
            item_img={menu.item_img}
            item_name={menu.item_name}
            item_order={menu.item_order}
            item_prefer={menu.item_prefer}
            item_price={menu.item_price}
            item_sales={menu.item_sales}
            item_sub={menu.item_sub}
            item_taxmny={menu.item_taxmny}
            item_vatmny={menu.item_vatmny}
            updated_at={menu.updated_at}
            key={menu.item_id}
            onClick={() => onClick(menu.item_id)}
        />
    ));
    return <div className={styles['menu-list']}>{list}</div>;
};

export default MenuItemList;
