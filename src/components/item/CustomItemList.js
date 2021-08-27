import React from 'react';
import styles from './Custom.module.scss';
import CustomItem from './CustomItem';

const CustomItemList = ({ menuList }) => {
    const itemList = menuList.map((data, index) => (
        <CustomItem datas={data.list} index={index} key={data.id} />
    ));
    return (<div className={styles['custom-lists']}>{itemList}</div>);
};

export default CustomItemList;
