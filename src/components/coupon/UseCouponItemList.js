import React from 'react';
import styles from './Coupon.module.scss';
import UseCouponItem from './UseCouponItem';


const UseCouponItemList = ({ cp_list }) => {
    const list = cp_list.map((item) => (
        <UseCouponItem key={item.cp_id} item={item}  />
    ));

    return (
        <div className={styles['coupon-list']}>
            <div className={styles['tr']}>
                <TD text={'쿠폰명'} />
                <TD text={'할인금액'} />
                <TD text={'사용조건'} />
                <TD text={'사용날짜'} />
            </div>
            {list}
        </div>
    );
};

function TD({ text }) {
    return (<div className={styles['td']}>{text}</div>);
}

export default UseCouponItemList;
