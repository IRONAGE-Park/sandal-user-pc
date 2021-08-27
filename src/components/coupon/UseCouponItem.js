import React from 'react';
import styles from './Coupon.module.scss';
import { numberFormat } from "../../lib/formatter";
import {calculateDay} from '../../lib/calculateDate';
// import classNames from 'classnames/bind';

// const cx = classNames.bind(styles);

const UseCouponItem = (props) => {

    const {
        // cp_datetime,
        cp_end,
        // cp_id,
        cp_minimum,
        cp_price,
        cp_start,
        cp_subject,
        cp_target,
        // cp_use,
        cp_use_date,
        // cz_id,
        // user_id,
    } = props.item;
    return (
        <div className={styles['coupon-item']}>
            <div className={styles['info']}>
                <CouponEventName event_name={cp_subject} />
                <CouponSale sale={`${numberFormat(cp_price)}원`} />
                <CouponEventSub sub_name={`최소주문금액 ${numberFormat(cp_minimum)}원`} />
                <CouponDate date={calculateDay(cp_use_date)} />
            </div>
        </div>
    );
};

function CouponDate({ date }) {
    return <div className={styles['date']}>{date}</div>;
}

function CouponEventName({ event_name }) {
    return <div className={styles['event-name']}>{event_name}</div>;
}

function CouponEventSub({ sub_name }) {
    return <div className={styles['sub-name']}>{sub_name}</div>;
}
function CouponSale({ sale }) {
    return <div className={styles['sale']}>할인 금액 {sale}</div>;
}

export default UseCouponItem;
