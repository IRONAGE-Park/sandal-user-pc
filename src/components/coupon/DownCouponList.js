import React from 'react';
import styles from './DownCoupon.module.scss';
import DownCouponItem from './DownCouponItem';

const DownCouponItemList = ({cp_list ,onClick}) => {
    
    const list = cp_list.map((cp) => (
        <DownCouponItem key={cp.cz_id} item={cp} check={cp.check}  onClick={() => onClick(cp.cz_id)}/>
    ));

    return (<div className={styles['downcoupon-list']}>{list}</div>);
};

export default DownCouponItemList;
