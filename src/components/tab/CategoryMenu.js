import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './CategoryMenu.module.scss';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


const CategoryMenu = ({ tabs, index, onChange,isPush }) => {
    const history = useHistory();

    const onClickTab = (url) => {
        if (url !== undefined || url!==null) {
            isPush ? history.push(url) : history.replace(url);
        }
    };

    const tabList = tabs.map((tab) => (
        <Tab
            label={tab.name}
            key={tab.name}
            className={styles['tab-item']}
            onClick={() => onClickTab(tab.url)}
        />
    ));

    return (
        <Tabs
            value={index}
            onChange={onChange}
            TabIndicatorProps={{
                style: {
                    backgroundColor: '#000',
                    height:'4px',
                    borderRadius:'100px'
                },
            }}
            className={styles['tabs']}
            centered={true}
        >
            {tabList}
        </Tabs>
    );
};

CategoryMenu.defaultProps = {
    tabs: null,
    index: 0,
    isPush : false,
    onChange: () => {},
};

export default CategoryMenu;
