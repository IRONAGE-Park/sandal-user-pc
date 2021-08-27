import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './SubTabMenu.module.scss';
import cn from 'classnames/bind';

const cx = cn.bind(styles);

const SubTabMenu = ({ tabs, index, onChange }) => {
    const history = useHistory();

    const onClickTab = (url) => {
        history.push(url);
    };

    const tabList = tabs.map((tab) => (
        <div  key={tab.url} className={cx('subtab-item',{active : index===tab.id})} onClick={()=>onClickTab(tab.url)}>
            <span>{tab.name}</span>
        </div>
    ));
    return (
        <div className={styles['subtab-list']}>
        {tabList}
        </div>
    );
};

SubTabMenu.defaultProps = {
    tabs: null,
    index: 0,
    isPush: false,
    onChange: () => {},
};

export default SubTabMenu;
