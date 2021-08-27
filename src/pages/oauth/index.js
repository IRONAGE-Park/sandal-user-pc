import React, { useEffect } from 'react';
import qs from 'qs';

import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

//api
import { getActiveAddr } from '../../api/address/address';
import { getNearStore } from '../../api/store/store';
import { socialRegister } from '../../api/social';
//hooks
import { useInit } from '../../hooks/useStore';
import { useModal } from '../../hooks/useModal';

//store
import { get_user_info } from '../../store/auth/auth';
import { PROTOCOL_ENV } from '../../paths';

const OAuth = ({ match, location }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const initStore = useInit();
    const openModal = useModal();

    const { type } = match.params;
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });

    const GetInfo = async (access_token) => {
        if (access_token) {
            try {
                dispatch(get_user_info(access_token));
                const res = await getActiveAddr(access_token);
                if (res) {
                    const { lat, lng, addr1, addr2, post_num } = res;
                    const near_store = await getNearStore(access_token,lat, lng, addr1);
                    initStore(
                        addr1,
                        addr2,
                        lat,
                        lng,
                        post_num,
                        near_store.data.query,
                    );
                } else {
                    initStore();
                }
                localStorage.setItem('access_token', access_token);
                history.replace('/');
            } catch (e) {
                history.replace('/error');
            }
        }
    };

    const Register = async (email, name, register_type) => {
        try {
            if (register_type === 'already') {
                history.replace('/');
                openModal(
                    '회원가입 실패',
                    '존재하는 이메일 주소로\n가입을 시도하셔서 가입에 실패하셨습니다.',
                );
            } else {
                const res = await socialRegister(email, name, register_type);
                if (res.data.access_token) {
                    dispatch(get_user_info(res.data.access_token));
                    localStorage.setItem('access_token', res.data.access_token);
                    initStore();
                    history.replace('/');
                }
            }
        } catch (e) {
            history.replace('/error');
        }
    };

    useEffect(() => {
        const { email, access_token, register_type, name } = query;
        //모바일이면 모바일로 리다이렉트
        if (isMobile()) {
            if (type === 'login') {
                window.location.href = `${PROTOCOL_ENV}m.ajoonamu.com/oauth/login?email=${email}&access_token=${access_token}&register_type=${register_type}`;
            } else if (type === 'register') {
                window.location.href = `${PROTOCOL_ENV}m.ajoonamu.com/oauth/register?name=${name}&email=${email}&register_kind=1&register_type=${register_type}`;
            }
        }
        //pc이면
        else {
            if (type === 'login') {
                GetInfo(access_token);
            } else if (type === 'register') {
                Register(email, name, register_type);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isMobile = () => {
        const UserAgent = navigator.userAgent;
        if (
            !(
                UserAgent.match(
                    /iPhone|iPod|iPad|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i,
                ) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null
            )
        ) {
            return false;
        } else {
            return true;
        }
    };

    return <></>;
};

export default OAuth;
