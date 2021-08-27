/*global kakao*/

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styles from './Address.module.scss';
import DeliveryItemList from '../../components/address/DeliveryItemList';
import { searchIcon } from 'components/svg/header';
import AddressModal from '../../components/modal/AddrModal';
import {
    insertAddress,
    deleteAddr,
    selectAddress,
    searchAddress,
    getDeliveryList,
} from '../../api/address/address';
import { useStore } from '../../hooks/useStore';
import { modalOpen } from '../../store/modal';
import Message from '../../components/assets/Message';
import produce from 'immer';
import { IconButton } from '@material-ui/core';
import Loading from '../../components/assets/Loading';

import { get_address } from '../../store/address/address';
import { get_near_store } from '../../store/address/store';

import { getNearStore } from '../../api/store/store';
import { noAuthGetNearStore } from '../../api/noAuth/store';
import { get_menulist } from '../../store/product/product';
import { Paths } from '../../paths';
import { useHistory } from 'react-router-dom';

const AddressContainer = () => {
    const modalDispatch = useDispatch();

    const openMessage = useCallback(
        (isConfirm, title, text, handleClick = () => {}) => {
            modalDispatch(modalOpen(isConfirm, title, text, handleClick));
        },
        [modalDispatch],
    );

    const dispatch = useDispatch();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const user_token = useStore(false);
    const [searchAddr, serSearch] = useState(''); //검색
    const [selectAddr, setSelectAddr] = useState(''); //선택
    const [detailAddr, setDetailAddr] = useState(''); //상세주소
    const [search_list, setSearchList] = useState(''); // 검색 리스트
    const [delivery_list, setDeliveryList] = useState([]);
    const [post_num, setPostNum] = useState('');
    const [open, setOpen] = React.useState(false);
    const mainSearchRef = useRef(null);

    //최근 선택한 주소지 들고오기
    const callDeliveryList = useCallback(async () => {
        //회원 주소 설정
        setLoading(true);
        if (user_token) {
            try {
                const res = await getDeliveryList(user_token);
                setDeliveryList(res.data.query);
            } catch (e) {}
        }
        //비회원
        else {
            const noAuthAddrs = JSON.parse(localStorage.getItem('noAuthAddrs'));
            if (noAuthAddrs) {
                setDeliveryList(noAuthAddrs);
            }
        }
        setLoading(false);
    }, [user_token]);

    //검색 api 호출
    const callSearchApi = useCallback(async () => {
        const res = await searchAddress(searchAddr);
        return res;
    }, [searchAddr]);

    //검색버튼 클릭
    const onClickSearch = useCallback(async () => {
        if (searchAddr !== '') {
            try {
                const result = await callSearchApi();
                setSearchList(result);
            } catch (e) {
                openMessage(
                    false,
                    '주소를 검색하는 도중 오류가 발생했습니다.',
                    '다시 시도해 주세요.',
                );
            }
        }
    }, [callSearchApi, searchAddr, openMessage]); //search 혹은 addrs 가 바뀌었을때만 함수생성

    //검색 모달 오픈
    const handleOpen = useCallback(() => {
        if (searchAddr === '') {
            openMessage(false, '검색어가 없습니다!', '검색어를 입력해 주세요.');
            return;
        } else {
            setOpen(true);
            onClickSearch();
        }
    }, [searchAddr, openMessage, onClickSearch]);

    //모달창 닫기
    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    //엔터키 추가
    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                handleOpen();
            }
        },
        [handleOpen],
    );

    //검색어 변경
    const onChangeSearchAddr = useCallback((e) => {
        serSearch(e.target.value);
    }, []);

    //상세주소 변경
    const onChangeDetailAddr = (e) => {
        setDetailAddr(e.target.value);
    };

    const onKeyPressDeliveryAddr = (e) => {
        if (e.key === 'Enter') {
            onClickDeliveryAddrInsert();
        }
    };

    //선택한 주소지로 설정 하기
    const onClickDeliveyAddr = useCallback(
        (delivery_id, addr1, addr2, lat, lng, post_num) => {
            openMessage(
                true,
                '선택한 주소지로 설정하시겠습니까?',
                '',
                async () => {
                    if (user_token) {
                        try {
                            // const res = await selectAddress(user_token, delivery_id);
                            await selectAddress(user_token, delivery_id);
                            dispatch(
                                get_address({
                                    addr1,
                                    addr2,
                                    lat,
                                    lng,
                                    post_num,
                                }),
                            );
                            const near_store = await getNearStore(
                                user_token,
                                lat,
                                lng,
                                addr1,
                            );

                            dispatch(get_near_store(near_store.data.query));
                            dispatch(get_menulist(null));

                            const redirect_url = JSON.parse(
                                sessionStorage.getItem('url'),
                            );
                            if (redirect_url) {
                                history.push(redirect_url.prev);
                            } else {
                                history.push(Paths.index);
                            }
                        } catch (e) {}
                    } else {
                        //로컬 스토리지에 있는 아이템을 들고온다.
                        //선택한 주소지가 있다는 것은 로컬스토리지에 아이템이 있다고 판단하고 조건을 뺀다.
                        const noAuthAddrs = JSON.parse(
                            localStorage.getItem('noAuthAddrs'),
                        );

                        //모든 활성화를 0으로 초기화
                        noAuthAddrs.map((item) => (item.active = 0));

                        //선택한 주소를 활성화
                        noAuthAddrs[delivery_id].active = 1;

                        //활성화된 스토리지의 주소를 제일 위로 올린다.
                        let tmp = noAuthAddrs[delivery_id];
                        noAuthAddrs.splice(delivery_id, 1);
                        noAuthAddrs.unshift(tmp);

                        //활성화된 정보를 갱신
                        localStorage.setItem(
                            'noAuthAddrs',
                            JSON.stringify(noAuthAddrs),
                        );

                        //갱신한 뒤 상태 업데이트 및 리덕스 업데이트
                        const temp = JSON.parse(
                            localStorage.getItem('noAuthAddrs'),
                        );
                        setDeliveryList(temp);
                        dispatch(
                            get_address({ addr1, addr2, lat, lng, post_num }),
                        );

                        const near_store = await noAuthGetNearStore(
                            lat,
                            lng,
                            addr1,
                        );

                        dispatch(get_near_store(near_store.data.query));
                        dispatch(get_menulist(null));

                        const redirect_url = JSON.parse(
                            sessionStorage.getItem('url'),
                        );
                        if (redirect_url) {
                            history.push(redirect_url.prev);
                        } else {
                            history.push(Paths.index);
                        }
                    }
                },
            );
        },
        [callDeliveryList, dispatch, openMessage, user_token],
    );

    //주소지 삭제
    const onRemoveAddr = useCallback(
        (delivery_id) => {
            openMessage(true, '해당 주소를 삭제하시겠습니까?', '', async () => {
                if (user_token) {
                    try {
                        await deleteAddr(user_token, delivery_id);
                        const index = delivery_list.findIndex(
                            (item) => item.delivery_id === delivery_id,
                        );

                        //삭제하려는 주소가 활성화 주소라면 배달지 설정 초기화
                        if (delivery_list[index].active === 1) {
                            dispatch(
                                get_address({
                                    addr1: null,
                                    addr2: null,
                                    lat: null,
                                    lng: null,
                                    post_num: null,
                                }),
                            );
                            dispatch(get_near_store(null));
                            dispatch(get_menulist(null));
                        }
                        setDeliveryList((list) =>
                            list.filter(
                                (item) => item.delivery_id !== delivery_id,
                            ),
                        );
                    } catch (e) {}
                } else {
                    const noAuthAddrs = JSON.parse(
                        localStorage.getItem('noAuthAddrs'),
                    );
                    if (noAuthAddrs) {
                        //선택한 주소가 현재 활성 주소일시.
                        if (noAuthAddrs.length !== 0) {
                            if (noAuthAddrs[delivery_id].active === 1) {
                                //배달지 없음으로 설정
                                dispatch(
                                    get_address({
                                        addr1: null,
                                        addr2: null,
                                        lat: null,
                                        lng: null,
                                        post_num: null,
                                    }),
                                );
                                dispatch(get_near_store(null));
                                dispatch(get_menulist(null));
                            }
                            //선택한 주소를 제일 위로 올리기.
                            noAuthAddrs.splice(delivery_id, 1);
                            localStorage.setItem(
                                'noAuthAddrs',
                                JSON.stringify(noAuthAddrs),
                            );
                            const temp = JSON.parse(
                                localStorage.getItem('noAuthAddrs'),
                            );
                            setDeliveryList(temp);
                        }
                    }
                }
            });
        },
        [openMessage, user_token, delivery_list, dispatch],
    );

    // 검색리스트(모달)에 나오는 주소를 클릭했을때 active 활성
    const onClickAddrItem = useCallback(
        (data, zipNo, index) => {
            setSelectAddr(data);
            setPostNum(zipNo);
            const new_list = search_list.map((item) => ({
                ...item,
                active: false,
            }));
            setSearchList(
                produce(new_list, (draft) => {
                    draft[index].active = true;
                }),
            );
        },
        [search_list],
    );

    //최근 주소지에 추가
    const onClickDeliveryAddrInsert = async () => {
        if (selectAddr === '') {
            openMessage(
                false,
                '주소를 선택하지 않으셨습니다.',
                '주소를 선택해 주세요.',
            );
        } else if (detailAddr === '') {
            openMessage(
                false,
                '상세 주소를 입력하지 않으셨습니다.',
                '상세 주소를 입력해 주세요',
            );
        } else {
            openMessage(
                true,
                '이 주소로 배달지를 설정하시겠습니까?',
                '',
                async () => {
                    if (user_token) {
                        try {
                            var geocoder = new kakao.maps.services.Geocoder();
                            var temp_lat, temp_lng;
                            //선택한 주소의 좌표정보 받아오기
                            geocoder.addressSearch(selectAddr, async function (
                                result,
                                status,
                            ) {
                                // 정상적으로 검색이 완료됐으면
                                if (status === kakao.maps.services.Status.OK) {
                                    temp_lat = result[0].y;
                                    temp_lng = result[0].x;
                                    try {
                                        const res = await insertAddress(
                                            user_token,
                                            post_num,
                                            selectAddr,
                                            detailAddr,
                                            0,
                                            temp_lat,
                                            temp_lng,
                                        );
                                        if (res.data.msg === '성공') {
                                            dispatch(
                                                get_address({
                                                    addr1: selectAddr,
                                                    addr2: detailAddr,
                                                    lat: temp_lat,
                                                    lng: temp_lng,
                                                    post_num: post_num,
                                                }),
                                            );

                                            const near_store = await getNearStore(
                                                user_token,
                                                temp_lat,
                                                temp_lng,
                                                selectAddr,
                                            );
                                            dispatch(
                                                get_near_store(
                                                    near_store.data.query,
                                                ),
                                            );
                                            dispatch(get_menulist(null));

                                            setOpen(false);
                                            const redirect_url = JSON.parse(
                                                sessionStorage.getItem('url'),
                                            );
                                            if (redirect_url) {
                                                history.push(redirect_url.prev);
                                            } else {
                                                history.push(Paths.index);
                                            }
                                        } else {
                                            openMessage(
                                                false,
                                                res.data.msg,
                                                '주변 매장정보를 확인해 주세요.',
                                            );
                                        }
                                    } catch (e) {
                                        setLoading(false);
                                    }
                                }
                                //검색이 완료되지 않앗으면.
                                else {
                                    setLoading(false);
                                }
                            });
                        } catch (e) {}
                    }
                    //비회원
                    else {
                        let geocoder = new kakao.maps.services.Geocoder();
                        let temp_lat, temp_lng;
                        //선택한 주소의 좌표정보 받아오기
                        geocoder.addressSearch(selectAddr, async function (
                            result,
                            status,
                        ) {
                            // 정상적으로 검색이 완료됐으면
                            if (status === kakao.maps.services.Status.OK) {
                                temp_lat = result[0].y;
                                temp_lng = result[0].x;
                                try {
                                    const near_store = await noAuthGetNearStore(
                                        temp_lat,
                                        temp_lng,
                                        selectAddr,
                                    );
                                    if (
                                        near_store.data.msg ===
                                        '배달 가능한 지역이 아닙니다.'
                                    ) {
                                        openMessage(
                                            false,
                                            near_store.data.msg,
                                            '주변 매장정보를 확인해 주세요.',
                                        );
                                    } else if (
                                        near_store.data.msg ===
                                        '배달 가능한 매장이 없습니다.'
                                    ) {
                                        openMessage(
                                            false,
                                            near_store.data.msg,
                                            '주변 매장정보를 확인해 주세요.',
                                        );
                                    }
                                    //배달 가능한 지역이라면
                                    else {
                                        //비회원일시 로컬스토리지에서 아이템을 들고온다.
                                        const noAuthAddrs = JSON.parse(
                                            localStorage.getItem('noAuthAddrs'),
                                        );
                                        //로컬 스토리지에 아이템이 있을시.
                                        if (noAuthAddrs) {
                                            //모든 활성화를 0으로 초기화
                                            noAuthAddrs.map(
                                                (item) => (item.active = 0),
                                            );
                                            //새로운 주소를 푸쉬
                                            noAuthAddrs.push({
                                                addr1: selectAddr,
                                                addr2: detailAddr,
                                                lat: temp_lat,
                                                lng: temp_lng,
                                                post_num: post_num,
                                                active: 1,
                                            });
                                            localStorage.setItem(
                                                'noAuthAddrs',
                                                JSON.stringify(
                                                    noAuthAddrs.reverse(),
                                                ),
                                            );
                                        }
                                        //로컬스토리지에 아이템이 없을시.
                                        else {
                                            localStorage.setItem(
                                                'noAuthAddrs',
                                                JSON.stringify([
                                                    {
                                                        addr1: selectAddr,
                                                        addr2: detailAddr,
                                                        lat: temp_lat,
                                                        lng: temp_lng,
                                                        post_num: post_num,
                                                        active: 1,
                                                    },
                                                ]),
                                            );
                                        }
                                        //모든 작업이 완료 되었다면. 리덕스에 좌표정보저장, 추가된 배열로 상태 업데이트
                                        const test2 = JSON.parse(
                                            localStorage.getItem('noAuthAddrs'),
                                        );
                                        dispatch(
                                            get_address({
                                                addr1: selectAddr,
                                                addr2: detailAddr,
                                                lat: temp_lat,
                                                lng: temp_lng,
                                                post_num: post_num,
                                            }),
                                        );

                                        dispatch(
                                            get_near_store(
                                                near_store.data.query,
                                            ),
                                        );
                                        dispatch(get_menulist(null));
                                        setDeliveryList(test2);
                                        setOpen(false);

                                        const redirect_url = JSON.parse(
                                            sessionStorage.getItem('url'),
                                        );
                                        if (redirect_url) {
                                            history.push(redirect_url.prev);
                                        } else {
                                            history.push(Paths.index);
                                        }
                                    }
                                } catch (e) {}
                            }

                            //검색이 완료되지 않앗으면.
                            else {
                                setLoading(false);
                            }
                        });
                    }
                },
            );
        }
    };
    useEffect(() => {
        window.scrollTo(0, 0);
        mainSearchRef.current.focus();
    }, []);

    useEffect(() => {
        callDeliveryList();
    }, [callDeliveryList]);

    useEffect(() => {
        setDetailAddr('');
        setSelectAddr('');
        setPostNum('');
    }, [open]);

    return (
        <>
            <div className={styles['input-banner']}>
                <div className={styles['addr-input']}>
                    <input
                        className={styles['search-input']}
                        placeholder="예) 샌달동 12-3 또는 샌달 아파트"
                        value={searchAddr}
                        onChange={onChangeSearchAddr}
                        onKeyPress={handleKeyPress}
                        ref={mainSearchRef}
                    />
                    <IconButton className={styles['icon']} onClick={handleOpen}>
                        <img src={searchIcon} alt="search" />
                    </IconButton>
                </div>
            </div>
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <div className={styles['addr-title']}>최근 배달 주소</div>
                    {loading ? (
                        <Loading open={loading} />
                    ) : (
                        <div className={styles['addr-list']}>
                            {delivery_list.length === 0 ? (
                                <Message
                                    msg={'최근 배달 주소가 없습니다.'}
                                    size={350}
                                />
                            ) : (
                                <DeliveryItemList
                                    addrs={delivery_list}
                                    onRemove={onRemoveAddr}
                                    onClick={onClickDeliveyAddr}
                                    user_token={user_token}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
            <AddressModal
                open={open} //핸들창 오픈여부
                handleClose={handleClose} //핸들 닫기
                onClickSearch={onClickSearch} //검색 버튼
                onClickDeliveryAddrInsert={onClickDeliveryAddrInsert} //최근배송지 추가
                searchAddr={searchAddr} //검색어
                selectAddr={selectAddr} // 선택된 주소
                onChangeSearchAddr={onChangeSearchAddr} //검색어 변경
                detailAddr={detailAddr} //상세주소
                onChangeDetail={onChangeDetailAddr} //상세주소 변경
                handleKeyPress={onClickSearch} //
                addrs={search_list} // 검색리스트
                onClickAddrItem={onClickAddrItem} //검색 주소지 클릭
                onKeyPressDeliveryAddr={onKeyPressDeliveryAddr}
            />
        </>
    );
};

export default AddressContainer;
