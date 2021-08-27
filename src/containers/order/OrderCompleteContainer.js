import React, { useCallback, useEffect, useState } from 'react';
//hooks
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useStore } from '../../hooks/useStore';

//style
import styles from './OrderComplete.module.scss';
import cn from 'classnames/bind';
//components
import StickerModal from '../../components/modal/StickerModal';
import Loading from '../../components/assets/Loading';
import { ButtonBase } from '@material-ui/core';
import OrderItemList from '../../components/order/OrderItemList';

//lib
import { numberFormat, stringToTel } from '../../lib/formatter';
import { modalOpen } from '../../store/modal';
import { calculateDaySection } from '../../lib/calculateDate';
//api
import { order_cancle } from '../../api/order/order';
import { getDetailOrderView } from '../../api/order/orderItem';
import { noAuthOrderView, noAutuOrderCancle } from '../../api/noAuth/order';
//path
import { Paths } from '../../paths';

const cx = cn.bind(styles);
const payments = ['페이플 간편결제', '계좌이체', '만나서 결제', '무통장 입금'];
const pay_type = ['card', 'transfer', 'meet', 'bank'];
const OrderCompleteContainer = ({ order_number }) => {
    const user_token = useStore(false);
    const history = useHistory();
    const { user } = useSelector((state) => state.auth);
    const company = useSelector(state => state.company.company);

    const modalDispatch = useDispatch();

    const openMessage = useCallback(
        (isConfirm, title, text, handleClick = () => { }) => {
            modalDispatch(modalOpen(isConfirm, title, text, handleClick));
        },
        [modalDispatch],
    );

    const [stickyOpen, setStickyOpen] = useState(false); //문구 서비스 모달
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orders, setOrders] = useState(null);
    const [od_status, setOdStatus] = useState("order_apply");
    const [cancelAble , setCancelAble] = useState(false);
    const [payment_type, setPaymentType] = useState({kind:payments[0] ,settle_case:pay_type[0]});


    const handleOpen = useCallback(() => setStickyOpen(true), []);
    const handleClose = useCallback(() => setStickyOpen(false), []);
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
        setLoading(true);
        try {
            let res = null;
            if (user_token) {
                res = await getDetailOrderView(user_token, order_number);
            } 
            else {
                res = await noAuthOrderView(order_number);
            }
            const { orders } = res;
            if (orders === undefined || orders === null) {
                openMessage(
                    false,
                    '주문번호가 존재하지 않습니다.',
                    '주문번호를 확인해주세요',
                );
                history.replace(Paths.index);
                setSuccess(false);
            } else {
                setOdStatus(orders.info[0].od_status);
                setPaymentType(getPaymentType(orders.settle_case));
                setCancelAble(calculateDaySection(orders.info[0].delivery_req_time,new Date()));
                setOrders(orders);
                setSuccess(true);
                openMessage(true, "문구 서비스를 신청하시겠습니까?", "", handleOpen);
            }
        } catch (e) {
            setSuccess(false);
            openMessage(
                false,
                '주문번호가 존재하지 않습니다.',
                '주문번호를 확인해주세요',
            );
            history.replace(Paths.index);
        }
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, openMessage, order_number, user_token]);

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
                        res = await order_cancle(user_token, order_number,payment_type.settle_case);
                    } else {
                        res = await noAutuOrderCancle(
                            order_number,
                            orders.info[0].s_hp,
                            payment_type.settle_case
                        );
                    }
                    if (res.data.msg.indexOf('이미 취소 된 거래건 입니다.') !== -1) {
                        openMessage(false, '이미 취소된 거래건 입니다.');
                    }
                    else if(res.data.msg.indexOf('잘못된') !==-1) {
                        openMessage('주문 취소중 오류가 발생했습니다.');
                    }
                    else {
                        openMessage(false, '정상적으로 취소되었습니다.');
                        setOdStatus("order_cancel");
                        history.push(Paths.index);
                    }
                } catch (e) {
                    console.error(e);
                }
                setLoading(false);
            },
        );
    };
    

    useEffect(() => {
        if (!order_number) {
            history.replace('/');
        } else {
            getOrderInfo();
        }
    }, [order_number, getOrderInfo, history]);

    return (
        <>
            {loading ? (
                <Loading open={true} />
            ) : (
                <>
                    {success && (
                        <>
                            <div className={styles['container']}>
                                <div className={styles['content']}>
                                    <div className={styles['message']}>
                                        <div className={styles['title']}>
                                            주문이 완료되었습니다.
                                        </div>
                                        <div className={styles['msg']}>
                                            {orders && `${orders.info[0].s_name}님`}{' '}
                                            저희 샌달 서비스를
                                            이용해주셔서 감사합니다.
                                            <br />
                                            아래 주문상세내역서는
                                            주문내역에서 다시 확인
                                            가능합니다.
                                            <br />
                                            (비회원 주문시 주문내역을 확인이
                                            어려울 수 있습니다.)
                                        </div>
                                        <div className={styles['order-number']}>
                                            주문번호 : {order_number}
                                        </div>
                                        {orders && orders.info[0].cancel_reason && <p className={styles['reject-reason']}>
                                            거절 사유: {orders.info[0].cancel_reason}
                                        </p>}
                                        <div className={styles['btn']}>
                                            <ButtonBase
                                                onClick={handleOpen}
                                                className={styles['item']}
                                            >
                                                문구서비스 신청
                                            </ButtonBase>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles['view-content']}>
                                    <div className={styles['order-view']}>
                                        <div className={styles['title']}>
                                            주문 상세 내역
                                        </div>
                                        <div className={styles['order-list']}>
                                            {orders && (
                                                <OrderItemList
                                                    items={orders.items}
                                                    info={orders.info}
                                                    center={false}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles['payment-view']}>
                                        <div className={styles['title']}>
                                            결제 내역
                                        </div>
                                        <div className={styles['box']}>
                                            <OrderInfoBox
                                                text={'주문번호'}
                                                value={
                                                    orders && orders.order_id
                                                }
                                            />
                                            <OrderInfoBox
                                                text={'주문일시'}
                                                value={
                                                    orders &&
                                                    orders.receipt_time ? orders.receipt_time : '미완료 결제'
                                                }
                                            />
                                            <OrderInfoBox
                                                text={'결제방식'}
                                                value={payment_type.kind}
                                            />
                                            <OrderInfoBox
                                                text={'결제금액'}
                                                value={
                                                    orders &&
                                                    `${numberFormat(
                                                        orders.info[0]
                                                            .receipt_price,
                                                    )}원`
                                                }
                                            />
                                            <OrderInfoBox
                                                text={'입금자명'}
                                                value={
                                                    orders && orders.info[0].s_name
                                                }
                                            />
                                    {payment_type.kind===payments[3] && 
                                        <>
                                            <OrderInfoBox
                                                text="입금은행"
                                                value={company && company.company_bankname}
                                                paddingBottom="10px"
                                            />
                                            <OrderInfoBox
                                                text="입금계좌"
                                                value={company && company.company_banknum}
                                                paddingBottom="10px"
                                            />
                                            <OrderInfoBox
                                                text="예금주명"
                                                value={company && company.company_bankuser}
                                            />
                                        </>}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles['user-content']}>
                                    <div className={styles['user-info']}>
                                        <div className={styles['title']}>
                                            배달정보
                                        </div>
                                        <div className={styles['context']}>
                                            <UserInfoBox
                                                text={'받는분'}
                                                value={
                                                    orders && orders.info[0].r_name
                                                }
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
                                                    orders.info[0]
                                                        .delivery_req_time
                                                }
                                            />
                                            <UserInfoBox
                                                text={'배달 주소'}
                                                value={
                                                    orders &&
                                                    `${orders.s_addr1} ${orders.s_addr2}`
                                                }
                                            />
                                            <UserInfoBox
                                                text={'요청 사항'}
                                                value={
                                                    orders &&
                                                    orders.info[0].delivery_memo
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className={styles['user-info']}>
                                        <div className={styles['title']}>
                                            주문정보
                                        </div>
                                        <div className={styles['context']}>
                                            <UserInfoBox
                                                text={'주문자'}
                                                value={
                                                    orders && orders.info[0].s_name
                                                }
                                            />
                                            <UserInfoBox
                                                text={'연락처'}
                                                value={
                                                    orders &&
                                                    stringToTel(
                                                        orders.info[0].s_hp,
                                                    )
                                                }
                                            />
                                            {user && (
                                                <UserInfoBox
                                                    text={'이메일'}
                                                    value={user.email}
                                                />
                                            )}

                                            <UserInfoBox
                                                text={'주문 종류'}
                                                value={
                                                    orders &&
                                                    orders.info[0].order_type ===
                                                        'reserve'
                                                        ? '예약주문'
                                                        : '배달주문'
                                                }
                                            />
                                            <UserInfoBox
                                                text={'요청 사항'}
                                                value={
                                                    orders &&
                                                    orders.info[0].order_memo
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className={styles['user-info']}>
                                        <div className={styles['title']}>
                                            매장정보
                                        </div>
                                        <div className={styles['context']}>
                                            <UserInfoBox
                                                text={'매장명'}
                                                value={
                                                    orders && orders.shop_name
                                                }
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
                                                    stringToTel(orders.shop_hp)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className={styles['order-cancle']}>
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
                                            : (cancelAble ? '주문 취소' :'주문 취소불가')}
                                        </ButtonBase>
                                    </div>
                                </div>
                            </div>
                            <StickerModal
                                open={stickyOpen}
                                handleClose={handleClose}
                                order_number={order_number}
                                token={user_token}
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
};

function OrderInfoBox({ text, value, auto, paddingBottom }) {
    return (
        <div className={styles['text-price']} style={{ paddingBottom }}>
            <div className={cx('text', { auto: auto })}>{text}</div>
            <div className={styles['price']}>{value}</div>
        </div>
    );
}

function UserInfoBox({ text, value }) {
    return (
        <div className={styles['box']}>
            <div className={styles['text']}>{text}</div>
            <div className={styles['value']}>{value}</div>
        </div>
    );
}

export default OrderCompleteContainer;
