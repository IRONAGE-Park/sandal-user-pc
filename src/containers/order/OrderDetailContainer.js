import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import OrderItemList from '../../components/order/OrderItemList';
import { ButtonBase } from '@material-ui/core';
import styles from './OrderDetail.module.scss';
import cn from 'classnames/bind';
import Loading from '../../components/assets/Loading';


//lib
import { numberFormat, stringToTel } from '../../lib/formatter';
import {calculateDaySection} from '../../lib/calculateDate';

import qs from 'qs';

import { modalOpen } from '../../store/modal';

//hook
import { useStore } from '../../hooks/useStore';

//api
import { order_cancle } from '../../api/order/order';
import { noAutuOrderCancle } from '../../api/noAuth/order';
import { getDetailOrderView } from '../../api/order/orderItem';


const payments = ['페이플 간편결제', '계좌이체', '만나서 결제', '무통장 입금'];
const pay_type = ['card', 'transfer', 'meet', 'bank'];
const cx = cn.bind(styles);

const OrderDetailContainer = (props) => {

    const query = qs.parse(props.location.search, {
        ignoreQueryPrefix: true,
    });
    const { order_id } = query;

    const modalDispatch = useDispatch();

    const openMessage = useCallback(
        (isConfirm, title, text, handleClick = () => { }) => {
            modalDispatch(modalOpen(isConfirm, title, text, handleClick));
        },
        [modalDispatch],
    );

    const user_token = useStore();
    const history = useHistory();
    const { user } = useSelector((state) => state.auth);
    const company = useSelector(state => state.company.company);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState(null);
    const [payple_info , setPaypleInfo] = useState(null);
    const [od_status, setOdStatus] = useState("order_apply");
    const [cancelAble , setCancelAble] = useState(false);
    const [payment_type, setPaymentType] = useState({
        kind: payments[0],
        settle_case: pay_type[0],
    });

    const getPaymentType = (settle_case) => {
        switch (settle_case) {
            case pay_type[0]:
                return {kind: payments[0] , settle_case};
            case pay_type[1]:
                return {kind: payments[1] , settle_case};
            case pay_type[2]:
                return {kind: payments[2] , settle_case};
            case pay_type[3]:
                return {kind: payments[3] , settle_case};
            default:
                return {kind: payments[0] , settle_case};
        }
    };


    const getOrderInfo = useCallback(async () => {

        if (user_token) {
            setLoading(true);
            try{
                const res = await getDetailOrderView(user_token, order_id);
                setOrders(res.orders);
                if(res.payple_info){
                setPaypleInfo(JSON.parse(res.payinfo.pp_result));
                }
                setOdStatus(res.orders.info[0].od_status);
                setCancelAble(calculateDaySection(res.orders.info[0].delivery_req_time,new Date()));
                setPaymentType(getPaymentType(res.orders.settle_case))
                setLoading(false);
            }
            catch(e){
                console.error(e);
            }   
      
        } else {
            history.replace('/');
        }
    }, [order_id, history,user_token]);

    const userOrderCancle = async () => {
        openMessage(
            true,
            '해당 상품을 취소하시겠습니까?',
            '취소를 원하시면 예를 눌러주세요',
            async () => {
               setLoading(true);
                try {
                    let res = null;
                    if (user_token) {
                        res = await order_cancle(user_token, order_id,payment_type.settle_case);
                    } else {
                        res = await noAutuOrderCancle(
                            order_id,
                            orders.info[0].s_hp,
                            payment_type.settle_case
                        );
                    }
                    if (res.data.msg.indexOf('이미 취소 된 거래건 입니다.') !== -1) {
                        openMessage(false, '이미 취소된 거래건 입니다.');
                        setOdStatus("order_cancel");

                    }
                    else if(res.data.msg.indexOf('잘못된')!==-1){
                        openMessage(false, '취소 오류가 발생했습니다.');
                    } 
                    else {
                        openMessage(false, '정상적으로 취소되었습니다.');
                        setOdStatus("order_cancel");

                    }
                } catch (e) {
                    console.error(e);
                }
               setLoading(false);
            },
        );
    };


    useEffect(() => {
        if (!order_id) {
            history.replace('/');
        } else {
            getOrderInfo();
        }
    }, [order_id, getOrderInfo, history]);
    return (
        <>
            {loading ? (
                <Loading open={true} />
            ) : (
                <div className={styles['container']}>
                    <div className={styles['content']}>
                        <div className={styles['detail-box']}>
                            <div className={styles['title']}>
                                주문 상세 보기
                            </div>
                            <div className={styles['preview-title-bar']}>
                                <div className={styles['order-info']}>
                                    <div className={styles['top']}>
                                        <div className={styles['order-date']}>
                                            {orders && (orders.receipt_time ? orders.receipt_time
                                            : (orders.info[0].settle_case === 'meet' ? '배송 접수' : company && `${company.company_bankname} ${company.company_banknum} ${company.company_bankuser}`))}
                                        </div>
                                        <div className={styles['order-id']}>
                                            주문번호 :{' '}
                                            {orders && orders.order_id}
                                        </div>
                                        <div className={styles['order-type']}>
                                            {od_status === "deposit_wait" && (orders.info[0].settle_case === 'meet' ? '만나서 결제' : '입금 대기')}
                                            {od_status === 'order_cancel' && (orders.info[0].cancel_reason === null ? '주문 취소' : '주문 거절')}
                                            {od_status === 'order_apply' && '입금확인'}
                                            {od_status === 'shipping' && '배송중'}
                                            {od_status === 'delivery_complete' && '배달완료'}
                                            {od_status === 'order_complete' && '주문완료'}
                                        </div>
                                    </div>
                                    <div className={styles['bottom']}>
                                        <div className={styles['req-date']}>
                                            배달 요청 시간 :{' '}
                                            {orders && orders.info[0].delivery_req_time}
                                        </div>
                                    </div>
                                    {orders && orders.info[0].cancel_reason && <p className={styles['reject-reason']}>
                                        거절 사유: {orders.info[0].cancel_reason}
                                    </p>}
                                </div>
                            </div>
                        </div>
                        <div className={styles['detail-box']}>
                            <div className={styles['title']}>
                                주문 상세 내역
                            </div>
                            <div className={styles['order-detail-view']}>
                                <div className={styles['order-item-list']}>
                                    {orders && (
                                        <OrderItemList
                                            items={orders.items}
                                            info={orders.info}
                                            center={true}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={styles['detail-box']}>
                            <div className={styles['title']}>배달정보</div>
                            <div className={styles['order-detail-view']}>
                                <div className={styles['context']}>
                                    <UserInfoBox
                                        text={'받는분'}
                                        value={orders && orders.info[0].r_name}
                                    />
                                    <UserInfoBox
                                        text={'연락처'}
                                        value={
                                            orders &&
                                            stringToTel(orders.info[0].r_hp)
                                        }
                                    />
                                    <UserInfoBox
                                        text={'배달 요청 시간'}
                                        value={
                                            orders &&
                                            orders.info[0].delivery_req_time
                                        }
                                    />
                                    <UserInfoBox
                                        text={'배달주소'}
                                        value={
                                            orders &&
                                            `${orders.s_addr1} ${orders.s_addr2}`
                                        }
                                    />
                                    <UserInfoBox
                                        text={'요청사항'}
                                        value={
                                            orders &&
                                            orders.info[0].delivery_memo
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles['detail-box']}>
                            <div className={styles['title']}>주문정보</div>
                            <div className={styles['order-detail-view']}>
                                <div className={styles['context']}>
                                    <UserInfoBox
                                        text={'주문자'}
                                        value={orders && orders.info[0].s_name}
                                    />
                                    <UserInfoBox
                                        text={'연락처'}
                                        value={
                                            orders &&
                                            stringToTel(orders.info[0].s_hp)
                                        }
                                    />
                                    {user && (
                                        <UserInfoBox
                                            text={'이메일'}
                                            value={user.email}
                                        />
                                    )}
                                    <UserInfoBox
                                        text={'주문종류'}
                                        value={
                                            orders &&
                                            orders.info[0].order_type ===
                                                'reserve'
                                                ? '예약주문'
                                                : '배달주문'
                                        }
                                    />
                                    <UserInfoBox
                                        text={'요청사항'}
                                        value={
                                            orders && orders.info[0].order_memo
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles['detail-box']}>
                            <div className={styles['store-info']}>
                                <div className={styles['title']}>매장정보</div>
                                <div className={styles['order-detail-view']}>
                                    <div className={styles['context']}>
                                        <UserInfoBox
                                            text={'매장명'}
                                            value={orders && orders.shop_name}
                                        />
                                        <UserInfoBox
                                            text={'매장주소'}
                                            value={
                                                orders &&
                                                `${orders.shop_addr1} ${orders.shop_addr2}`
                                            }
                                        />
                                        <UserInfoBox
                                            text={'연락처'}
                                            value={
                                                orders &&
                                                orders.shop_hp &&
                                                stringToTel(orders.shop_hp)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles['order-info']}>
                                <div className={styles['title']}>결제금액</div>
                                <div className={styles['order-detail-view']}>
                                    <div className={styles['order-box']}>
                                        <OrderInfoBox
                                            text={'주문금액'}
                                            value={
                                                orders &&
                                                numberFormat(orders.total_price)
                                            }
                                        />
                                        <OrderInfoBox
                                            text={'배달비용'}
                                            value={
                                                orders &&
                                                `${numberFormat(
                                                    orders.send_cost,
                                                )}`
                                            }
                                        />
                                        <OrderInfoBox
                                            text={'쿠폰할인'}
                                            value={
                                                orders &&
                                                `-${numberFormat(
                                                    orders.cp_price,
                                                )}`
                                            }
                                        />
                                        <OrderInfoBox
                                            text={'포인트사용'}
                                            value={
                                                orders &&
                                                `-${numberFormat(
                                                    orders.point_price,
                                                )}`
                                            }
                                        />
                                    </div>

                                    <div className={styles['total']}>
                                        <div className={styles['box']}>
                                            <div className={styles['text']}>
                                                합계
                                            </div>
                                            <div className={styles['value']}>
                                                {orders &&
                                                    numberFormat(
                                                        orders.receipt_price,
                                                    )}{' '}
                                                <span>원</span>
                                            </div>
                                        </div>
                                        <div className={cx('box', 'payment')}>
                                            <div className={styles['text']}>결제 방식</div>
                                            <div className={styles['value']}>
                                                {payment_type.kind}
                                                {payple_info &&
                                                    payple_info.PCD_PAY_CARDNAME}
                                            </div>
                                        </div>
                                        {payment_type.kind===payments[0] &&
                                            <div className={cx('box', 'payment-type')}>
                                               <div
                                                   className={styles['text']}
                                               ></div>
                                               <div className={styles['value']}>
                                                   {payple_info &&
                                                       payple_info.PCD_PAY_CARDNUM}{' '}
                                               </div>
                                           </div>
                                        }
                                 
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['cancle-area']}>
                            <ButtonBase
                                className={styles['btn']}
                                onClick={orders &&
                                (od_status === 'order_cancel' || od_status === 'order_complete' || od_status === 'delivery_complete' || !cancelAble)
                                    ? () => {}
                                    : userOrderCancle
                                }
                                disabled={(od_status === 'order_cancel' || od_status === 'order_complete' || od_status === 'delivery_complete'|| !cancelAble)}
                                disableRipple={(od_status === 'order_cancel' || od_status === 'order_complete' || od_status === 'delivery_complete'|| !cancelAble)}
                            >
                                {orders &&
                                (od_status === 'order_cancel') ? (orders.info[0].cancel_reason === null ? '주문 취소 완료' : '주문 거절')
                                : (od_status === 'delivery_complete') ? '배달완료'
                                : (od_status === 'order_complete') ? '주문완료'
                                : (cancelAble ? '주문 취소' :'주문 취소불가')
                                }
                            </ButtonBase>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

function UserInfoBox({ text, value }) {
    return (
        <div className={styles['box']}>
            <div className={styles['text']}>{text}</div>
            <div className={styles['value']}>{value}</div>
        </div>
    );
}

function OrderInfoBox({ text, value }) {
    return (
        <div className={styles['order-item']}>
            <div className={styles['text']}>{text}</div>
            <div className={styles['value']}>
                {value}
                <span>원</span>
            </div>
        </div>
    );
}

export default OrderDetailContainer;
