import React from 'react';
import styles from './Coupon.module.scss';
import CouponItem from './CouponItem';

const CouponItemList = ({ cp_list, check }) => {
    const list = cp_list.map((cp) => (
        <CouponItem key={cp.cp_id} item={cp} check={check} />
    ));

    return (
        <div className={styles['coupon-list']}>
            <div className={styles['tr']}>
                <TD text={'쿠폰명'} />
                <TD text={'할인금액'} />
                <TD text={'사용조건'} />
                <TD text={'기간'} />
            </div>
            {list}
        </div>
    );
};

function TD({ text }) {
    return (<div className={styles['td']}>{text}</div>);
}

export default CouponItemList;
