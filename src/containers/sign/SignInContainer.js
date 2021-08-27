import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
import styles from './Sign.module.scss';
import Button from 'components/button/Button';
import { localLogin } from '../../api/auth/auth';
import { get_user_info } from '../../store/auth/auth';
import cn from 'classnames/bind';
import {
    KakaoLogo,
    NaverLogo,
    FacebookLogo,
} from '../../components/svg/sign/social';
import CheckBox from 'components/checkbox/CheckBox';
import { get_address } from '../../store/address/address';
import { getActiveAddr } from '../../api/address/address';
import { useModal } from '../../hooks/useModal';
import { isEmailForm } from '../../lib/formatChecker';
import { getNearStore } from '../../api/store/store';
import { get_near_store } from '../../store/address/store';
import { get_breakMenuList } from '../../store/product/braekfast';
import { get_menulist } from '../../store/product/product';

const cx = cn.bind(styles);

const SignInContainer = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const openModal = useModal();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailInput = useRef(null);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };
    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const [checked, setChecked] = useState(false);

    const onChangeChecked = useCallback((e) => {
        setChecked(e.target.checked);
    }, []);

    const onClickSignUp = useCallback(() => {
        history.push(Paths.ajoonamu.signup);
    }, [history]);

    const onClickRecovery = useCallback(() => {
        history.push(Paths.ajoonamu.recovery);
    }, [history]);


    const onClickLogin = useCallback(async () => {
        if (!isEmailForm(email)) {
            openModal('이메일이 형식에 맞지 않습니다!', '확인 후 다시 작성해 주세요.');
        } else {
            try {
                const res = await localLogin(email, password);
                if (res.status === 200) {
                    // 회원가입 안되있는 이메일
                    if (res.data.msg === '회원가입 되어있지 않은 이메일입니다.') {
                        openModal(res.data.msg, '아이디를 다시 한 번 확인해 주세요.');
                    }
                    // 비밀번호가 틀렸을 때
                    else if (res.data.msg === '비밀번호가 틀렸습니다.') {
                        openModal(res.data.msg, '비밀번호를 다시 한 번 확인해 주세요.');
                    }
                    // 탈퇴한 이메일일 때.
                    else if (res.data.msg === '탈퇴한 이메일입니다.') {
                        openModal(res.data.msg, '아이디를 다시 한 번 확인해 주세요.');
                    }
                    // 로그인 성공 했을 때.
                    else if (res.data.access_token) {
                        //활성주소가 있는지 받아옴
                        dispatch(get_user_info(res.data.access_token));

                        const active_addr = await getActiveAddr(res.data.access_token);
                        localStorage.setItem('access_token', res.data.access_token);
                        if (checked) {
                            const newObj = {
                                email: email,
                                checked: checked,
                            };
                            localStorage.setItem('user', JSON.stringify(newObj));
                        } else {
                            localStorage.removeItem('user');
                        }
                        if(active_addr){
                            dispatch(get_address(active_addr))
                            const {lat,lng,addr1} = active_addr;
                            const near_store = await getNearStore(res.data.access_token,lat,lng,addr1);
                            dispatch(get_near_store(near_store.data.query));
                            dispatch(get_menulist(null));
                            dispatch(get_breakMenuList(null));
                        }
                        else{
                            dispatch(get_address({addr1:null, addr2:null,lat:null,lng:null,post_num:null}));
                            dispatch(get_near_store(null));
                            dispatch(get_menulist(null));
                            dispatch(get_breakMenuList(null));
                        }
                        const url = JSON.parse(sessionStorage.getItem('url'));
                        history.replace(url.prev);
                    }
                } else {
                    openModal('로그인에 실패하였습니다.', '이메일 혹은 패스워드를 확인해주세요.');
                }
            } catch (e) {
                openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
                history.replace(Paths.index);
            }
        }
    }, [history, checked, dispatch, email, password, openModal]);

    
    const socialLoginClickHandler = useCallback((type) => {
        window.location = Paths.api + 'user/' + type + '?device=pc';
    }, []);

    useEffect(() => {
        const data = localStorage.getItem('user');
        if (data !== null) {
            const temp = JSON.parse(data);
            setEmail(temp.email);
            setChecked(temp.checked);
        }
    }, []);

    useEffect(() => {
        emailInput.current.focus();
    }, [])

    const kepressEvent = e => {
        if (e.key === 'Enter') {
            onClickLogin();
        }
    };

    return (
        <div className={styles['container']}>
            <div className={cx('content', 'sign-in')}>
                <div className={styles['title']}>로그인</div>
                <div className={styles['user-input']}>
                    <input
                        type="text"
                        name={'email'}
                        value={email}
                        onChange={onChangeEmail}
                        onKeyDown={kepressEvent}
                        placeholder="이메일"
                        ref={emailInput}
                    />
                    <input
                        type="password"
                        name={'password'}
                        value={password}
                        onKeyDown={kepressEvent}
                        onChange={onChangePassword}
                        placeholder="비밀번호"
                    />
                </div>
                <div className={styles['util']}>
                    <div className={styles['keep-mail']}>
                        <CheckBox
                            id={'check1'}
                            text={'이메일 저장하기'}
                            onChange={onChangeChecked}
                            check={checked}
                        />
                    </div>
                    <div
                        className={styles['forgot-mail']}
                        onClick={onClickRecovery}
                    >
                        <label className={styles['sub-text']}>
                            아이디/비밀번호 찾기
                        </label>
                    </div>
                </div>

                <Button
                    title={'로그인'}
                    onClick={onClickLogin}
                    toggle={true}
                />
                <Button title={'회원가입'} onClick={onClickSignUp}></Button>

                <div className={styles['sns-box']}>
                    <div className={styles['social-login']}>
                        <div className={styles['text']}>간편 로그인</div>
                        <div className={styles['line']}></div>
                    </div>

                    <div className={styles['social']}>
                        <div className={styles.sns}>
                            <img src={NaverLogo} onClick={() => socialLoginClickHandler('naver')} alt="naver"/>
                        </div>
                        <div className={styles.sns}>
                            <img src={KakaoLogo} onClick={() => socialLoginClickHandler('kakao')} alt="kakao"/>
                        </div>
                        <div className={styles.sns}>
                            <img src={FacebookLogo} onClick={() => socialLoginClickHandler('facebook') } alt="facebook"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInContainer;
