import React, { useCallback, useEffect } from 'react';
import { localLogout } from '../../api/auth/auth';
import { Paths } from '../../paths';
import { logout } from '../../store/auth/auth';
import { get_address } from '../../store/address/address';
import { useDispatch } from 'react-redux';
import { modalOpen } from '../../store/modal';
import { get_menulist } from '../../store/product/product';
import { get_near_store } from '../../store/address/store';
import { noAuthGetNearStore } from '../../api/noAuth/store';

export default ({ history }) => {
    const dispatch = useDispatch();
    const modalDispatch = useDispatch();

    const openMessage = useCallback(
        (isConfirm, title, text, handleClick = () => {}) => {
            modalDispatch(modalOpen(isConfirm, title, text, handleClick));
        },
        [modalDispatch],
    );

    const onLogoutListener = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const res = await localLogout(token);
                if (res.status === 'success') {
                    dispatch(logout());

                    //모든 리덕스 초기화
                    dispatch(get_address({addr1:null,addr2:null ,lat:null,lng:null}));
                    dispatch(get_near_store(null));
                    dispatch(get_menulist(null));
                    openMessage(false, '로그아웃 성공!', '성공적으로 로그아웃 되었습니다.');
                    localStorage.removeItem('access_token');
                    const noAuthAddrs = JSON.parse(localStorage.getItem('noAuthAddrs'));
                    if(noAuthAddrs){
                        const index = noAuthAddrs.findIndex((item) =>item.active===1);
                        if(index!==-1){
                            const {addr1, addr2,lat,lng,post_num} = noAuthAddrs[index];
                            dispatch(get_address({addr1,addr2,lat,lng,post_num}));
                            const near_store = await noAuthGetNearStore(lat,lng,addr1);
                            dispatch(get_near_store(near_store.data.query));
                        }
                    }
                } else {
                    openMessage(false, '치명적인 에러!');
                }
            } catch (e) {
                openMessage(false, '유효하지 않은 토큰입니다!', '잠시 후 다시 시도해 주세요!');
            }
        } else {
            openMessage(false, '잘못된 접근입니다.', '잠시 후 다시 시도해 주세요!');
        }
        history.replace(Paths.index);
    }, [dispatch, history, openMessage]);

    useEffect(() => {
        onLogoutListener();
    }, [onLogoutListener]);
    return <></>;
};
