import React from 'react';
import styles from './Addr.module.scss';
import { ButtonBase } from '@material-ui/core';
import cn from 'classnames/bind';
const cx = cn.bind(styles);
const AddrItem = ({ jibunAddr, roadAddr, onClick, active }) => {
    return (
        <ButtonBase
            className={cx('address-item', { active: active })}
            onClick={onClick}
        >
            <JibunAddrBox jibunAddr={jibunAddr}></JibunAddrBox>
            <RoadAddrBox roadAddr={roadAddr}></RoadAddrBox>
        </ButtonBase>
    );
};
const JibunAddrBox = ({ jibunAddr }) => {
    return <div className={styles['jibun-box']}>{jibunAddr}</div>;
};
const RoadAddrBox = ({ roadAddr }) => {
    return (
        <div className={styles['roadAddr-box']}>
            <AddrBtn />
            {roadAddr}
        </div>
    );
};
const AddrBtn = () => {
    return <div className={styles['btn']}>지번</div>;
};

export default AddrItem;
