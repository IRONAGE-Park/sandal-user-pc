import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './OrderList.module.scss';
import { Paths } from 'paths';
import Message from 'components/assets/Message';
import Loading from '../../components/assets/Loading';
import { getOrderList } from '../../api/order/orderItem';
import { useStore } from '../../hooks/useStore';
import PreviewOrderList from '../../components/order/PreviewOrderItemList';
import DateRangePicker from '../../components/mypage/DateRangePicker';
import { calculateDate } from '../../lib/calculateDate';
import qs from 'qs';
import ListPaging from '../../components/sidebar/ListPaging';

const PAGE_PER_VIEW = 2;

//주문내역 페이지
const OrderListContainer = () => {
    const user_token = useStore(true);
    const history = useHistory();
    const location = useLocation();

    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    
    const page = query.page ? parseInt(query.page) : 1;

    const [startDate, setStartDate] = useState(
        calculateDate(new Date(), 7, 'DATE'),
    );
    const [endDate, setEndDate] = useState(
        new Date()
    );
    const [order_list, setOrderList] = useState([]); //전체 데이터.
    const [loading, setLoading] = useState(false); //로딩

    const callOrderListApi = useCallback(async () => {
        setLoading(true);
        if (user_token) {
            try {
                const res = await getOrderList(
                    user_token,
                    0, 100,
                    // (page - 1) * PAGE_PER_VIEW,
                    // PAGE_PER_VIEW,
                    startDate,
                    endDate,
                );
                setOrderList(res.orders ? res.orders : []);
                history.replace(`${Paths.ajoonamu.mypage}/order_list`)
            } catch (e) {
                console.log(e);
            }
        }
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_token, startDate, endDate, /*page*/]);

    const onClickOrderItem = useCallback(
        (order_id) => {
            history.push(
                `${Paths.ajoonamu.mypage}/order_detail?order_id=${order_id}`,
            );
        },
        [history],
    );

    useEffect(() => {
        callOrderListApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        sessionStorage.setItem('order_start_date', `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}`);
        sessionStorage.setItem('order_end_date', `${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}`);
    }, [startDate, endDate]);

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <div className={styles['title']}>주문내역</div>
            </div>
            <DateRangePicker
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onClick={callOrderListApi}
            />
            {loading ? (
                <Loading open={loading} />
            ) : (
                <>
                    <div className={styles['order-list']}>
                        {order_list.length !== 0 ? (
                            <>
                                <PreviewOrderList
                                    order_list={order_list.slice((page - 1) * PAGE_PER_VIEW, page * PAGE_PER_VIEW)}
                                    onClick={onClickOrderItem}
                                />
                                <ListPaging
                                    baseURL={Paths.ajoonamu.mypage + '/order_list'}
                                    currentPage={page}
                                    pagePerView={PAGE_PER_VIEW}
                                    totalCount={order_list.length}
                                />
                            </>
                        ) : (
                            <Message
                                msg={'주문 내역이 존재하지 않습니다.'}
                                isButton={true}
                                buttonName={'주문하러 가기'}
                                onClick={() =>
                                    history.push(`${Paths.ajoonamu.shop}?tab=0`)
                                }
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
export default OrderListContainer;
