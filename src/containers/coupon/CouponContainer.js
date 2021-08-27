import React, { useState, useEffect, useCallback } from 'react';
import { Paths } from 'paths';
import styles from './Coupon.module.scss';
import SubTabMenu from '../../components/tab/SubTabMenu';
import CouponItemList from '../../components/coupon/CouponItemList';
import UseCouponItemList from '../../components/coupon/UseCouponItemList';
import { useHistory, withRouter } from 'react-router-dom';
import qs from 'qs';
import DownCouponItemList from '../../components/coupon/DownCouponList';
import { useStore } from '../../hooks/useStore';
import {
    getMyCoupons,
    getDownloadCpList,
    downloadCoupon,
    couponInput,
    getUseCpList
} from '../../api/coupon/coupon';
import Loading from '../../components/assets/Loading';
import Message from '../../components/assets/Message';
import produce from 'immer';
import cn from 'classnames/bind';
import DateRangePicker from '../../components/mypage/DateRangePicker';
import { useModal } from '../../hooks/useModal';
import ListPaging from '../../components/sidebar/ListPaging';
import { calculateDate } from '../../lib/calculateDate';

const cx = cn.bind(styles);

const PAGE_PER_VIEW = 5;

const tabInit = [
    {
        id: 0,
        url: `${Paths.ajoonamu.mypage}/coupon?tab=0`,
        name: '내 쿠폰',
    },
    {
        id: 1,
        url: `${Paths.ajoonamu.mypage}/coupon?tab=1`,
        name: '쿠폰받기',
    },
    {
        id: 2,
        url: `${Paths.ajoonamu.mypage}/coupon?tab=2`,
        name: '쿠폰 사용 내역',
    },
];

const CouponConatiner = (props) => {
    const openModal = useModal();

    const query = qs.parse(props.location.search, {
        ignoreQueryPrefix: true,
    });
    const history = useHistory();

    const page = query.page ? parseInt(query.page) : 1;

    const [startDate, setStartDate] = useState(calculateDate(new Date(), 7, 'DATE'));
    const [endDate, setEndDate] = useState(new Date());

    const [loading, setLoading] = useState(false);
    const [index, setIndex] = useState(0);
    const [cp_list, setCpList] = useState([]);
    const [user_input_cp, setUserInputCp] = useState('');
    const [down_cp_list, setDownCpList] = useState([]);
    const [use_cp_list, setUseCpList] = useState([]);
    const user_token = useStore();

    const onChangeIndex = (idx) => setIndex(idx);
    const onChangeUserInputCp = (e) => setUserInputCp(e.target.value);

    const getTitle = useCallback(() => {
        if (index === 0) {
            return '내 쿠폰';
        } else if (index === 1) {
            return '쿠폰받기';
        } else if (index === 2) {
            return '쿠폰사용내역';
        }
    }, [index]);

    //현재 보유한 쿠폰 리스트
    const getMyCouponList = async () => {
        setLoading(true);
        if (user_token) {
            const res = await getMyCoupons(user_token);
            setCpList(res);
        }
        setLoading(false);
    };

    // 다운로드 가능한 쿠폰 리스트
    const getDownCouponList = async () => {
        setLoading(true);
        if (user_token) {
            const res = await getDownloadCpList(user_token);
            setDownCpList(res);
        }
        setLoading(false);
    };

    const getUseCouponList = async () => {
        setLoading(true);
        if (user_token) {
            try {
    
                const res = await getUseCpList(user_token, startDate, endDate);
                setUseCpList(res);
                if(index===2)
                  history.replace(`${Paths.ajoonamu.mypage}/coupon?tab=2`);

            } catch (e) {
                console.log(e);
            }
        }
        setLoading(false);
    }

    const callCouponDownload = useCallback(
        async (cz_id) => {
            setLoading(true);
            try {
                const res = await downloadCoupon(user_token, cz_id);
                if (
                    res.data.msg === '이미 해당 쿠폰존에서 받은 쿠폰이력이 있습니다.'
                ) {
                    openModal('이미 다운로드 한 쿠폰입니다.', res.data.msg);
                } else {
                    openModal('다운로드 성공했습니다.');
                    getMyCouponList();
                }
                const idx = down_cp_list.findIndex(
                    (item) => item.cz_id === cz_id,
                );
                setDownCpList(
                    produce(down_cp_list, (draft) => {
                        draft[idx].check = true;
                    }),
                );
            } catch (e) {

            }
            setLoading(false);
        },
        [user_token, down_cp_list, openModal],
    );

    const inputCoupon = useCallback(async () => {
        if (user_input_cp === '') {
            return;
        }
        setLoading(true);
        try {
            const res = await couponInput(user_token, user_input_cp);
            if (res.data.msg === '성공') {
                openModal('쿠폰 등록이 완료되었습니다.');
            }
        } catch (e) {
            
        }

        setLoading(false);
    }, [user_token, user_input_cp, openModal]);
    useEffect(() => {
        getMyCouponList();
        getDownCouponList();
        getUseCouponList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (query.tab !== undefined) {
            setIndex(parseInt(query.tab));
        }
    }, [query]);

    return (
        <div className={styles['container']}>
            <SubTabMenu tabs={tabInit} onChange={onChangeIndex} index={index} />
            <div className={styles['content']}>
                {index === 0 && (
                    <div className={styles['input-coupon']}>
                        <div className={styles['text']}>쿠폰 코드 입력</div>
                        <input
                            className={styles['code']}
                            value={user_input_cp}
                            onChange={onChangeUserInputCp}
                            placeholder="등록할 쿠폰번호를 입력해 주세요."
                        ></input>
                        <div className={styles['btn']} onClick={inputCoupon}>
                            쿠폰등록
                        </div>
                    </div>
                )}
                <div className={cx('tab-title', { border_none: index === 0 })}>
                    {getTitle()}
                </div>
                {index === 2 &&
                    <DateRangePicker
                        startDate={startDate} setStartDate={setStartDate}
                        endDate={endDate} setEndDate={setEndDate}
                        onClick={getUseCouponList} // 임시
                    />}
                <div className={styles['coupon-list']}>
                    {index === 0 && (
                        <>
                            {cp_list.length !== 0 ? (
                                <CouponItemList cp_list={cp_list} />
                            ) : (
                                <Message
                                    src={false}
                                    msg={'보유하고 있는 쿠폰이 없습니다.'}
                                />
                            )}
                        </>
                    )}
                    {index === 1 && (
                        <>
                            {down_cp_list.length !== 0 ? (
                                <>
                                    <DownCouponItemList
                                        cp_list={down_cp_list}
                                        onClick={callCouponDownload}
                                    />
                                </>
                            ) : (
                                <Message
                                    src={false}
                                    msg={'발급 받을 수 있는 쿠폰이 없습니다.'}
                                />
                            )}
                        </>
                    )}
                    {index === 2 &&
                    <>
                        {use_cp_list.length !== 0 ? (<>
                            <UseCouponItemList  cp_list = {use_cp_list.slice((page - 1) * PAGE_PER_VIEW, page * PAGE_PER_VIEW) }/>
                            <ListPaging
                                baseURL={Paths.ajoonamu.mypage + '/coupon?tab=2'}
                                currentPage={page}
                                pagePerView={PAGE_PER_VIEW}
                                totalCount={5}
                            />
                        </>) : <Message msg="사용하신 쿠폰이 없습니다." />}
                    </>}
                </div>
            </div>
            <Loading open={loading} />
        </div>
    );
};

export default withRouter(CouponConatiner);
