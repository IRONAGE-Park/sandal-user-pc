import React from 'react';
import styles from './DownCoupon.module.scss';
import DownCoupon from 'components/svg/coupon/down.svg';
import { numberFormat } from '../../lib/formatter';
import CouponCheck from '../svg/coupon/Check';
import { ButtonBase } from '@material-ui/core';

const DownCouponItem = (props) => {
    const {
        // cp_id,
        // cz_datetime,
        // cz_download,
        cz_end,
        // cz_id,
        // cz_limit,
        // cz_minimum,
        // cz_period,
        cz_price,
        cz_start,
        cz_subject,
        // cz_target,
    } = props.item;
    return (
        <ButtonBase className={styles['coupon-item']} onClick={props.onClick}>
            <div className={styles['down']}>
                <CouponDown check={props.check} />
            </div>
            <div className={styles['info']}>
                <div className={styles['pd-box']}>
                    <CouponEventName event_name={cz_subject} />
                    <CouponSale sale={cz_price} />
                    <CouponEventSub sub_name={cz_subject} />
                    <CouponDate start={cz_start} end={cz_end} />
                </div>
            </div>
        </ButtonBase>
    );
};
function CouponEventName({ event_name }) {
    return <div className={styles['event-name']}>{event_name}</div>;
}
function CouponSale({ sale }) {
    return <div className={styles['sale']}>{numberFormat(sale)}원 할인</div>;
}
function CouponEventSub({ sub_name }) {
    return <div className={styles['sub-name']}>{sub_name}</div>;
}
function CouponDate({ start, end }) {
    return (
        <div className={styles['date']}>
            {start} ~ {end}
        </div>
    );
}
function CouponDown({ check }) {
    return (
        <>{!check ? <img src={DownCoupon} alt="다운" /> : <CouponCheck />}</>
    );
}

export default DownCouponItem;
