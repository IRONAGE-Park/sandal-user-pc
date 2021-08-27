import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import useInputs from '../../hooks/useInputs';
import { useHistory } from 'react-router-dom';
import { Paths } from '../../paths';
import styles from './Sign.module.scss';
import SignNormalInput from '../../components/sign/SignNormalInput';
import SignAuthInput from '../../components/sign/SignAuthInput';
import Button from 'components/button/Button';
import CheckBox from 'components/checkbox/CheckBox';
import classNames from 'classnames/bind';
import {
    localLogin,
    localRegister,
} from '../../api/auth/auth';
import { useModal } from '../../hooks/useModal';
import { isEmailForm, isPasswordForm } from '../../lib/formatChecker';
import AuthPhone from '../../components/assets/AuthPhone';
import ShowAgree from '../../components/modal/ShowAgree';

const cx = classNames.bind(styles);

const initialUserState = {
    email: '',
    password: '',
    password_confirm: '',
    agree_marketing: 0,
};

const initCheck = {
    allCheck: false,
    check1: false,
    check2: false,
    check3: false,
};

const checkReducer = (state, action) => {
    switch (action.type) {
        case 'ALL_CHECK':
            return {
                ...state,
                allCheck: action.check,
            };
        case 'CHECK1':
            return {
                ...state,
                check1: action.check,
            };
        case 'CHECK2':
            return {
                ...state,
                check2: action.check,
            };
        case 'CHECK3':
            return {
                ...state,
                check3: action.check,
            };
        default:
            return state;
    }
};

const SignUpContainer = () => {
    const openModal = useModal(); 
    const [user_state, onChange] = useInputs(initialUserState);
    const {
        email,
        password,
        password_confirm,
    } = user_state;

    const history = useHistory();
    const [compare, setCompare] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [overlap, setOverlap] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneAuth, setPhoneAuth] = useState(false);
    const [check, dispatchCheck] = useReducer(checkReducer, initCheck);
    const { check1, check2, check3 } = check;


    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    
    const updateToggle = useCallback(() => {
        const checkbox = check1 && check2 ? true : false;
        const userinfo = email.length !== 0 && compare ? true : false;
        let result = checkbox && userinfo && overlap && phoneAuth ? true : false;
        setToggle(result);
    }, [check1, check2, email, compare, overlap, phoneAuth]);

    //패스워드 매칭 체크
    const matchPassword = useCallback(() => {
        if (password.length !== 0 && password_confirm.length !== 0) {
            setCompare(password === password_confirm);
        } else {
            setCompare(false);
        }
    }, [password, password_confirm]);

    // 단일 체크박스 변경시 올체크인지 확인
    const onToggleCheck = useCallback(() => {
        if (check1 && check2 && check3) {
            dispatchCheck({ type: 'ALL_CHECK', check: true });
        } else if (!check1 || !check2 || !check3) {
            dispatchCheck({ type: 'ALL_CHECK', check: false });
        }
    }, [check1, check2, check3]);

    //모두 체크인지 확인 함수
    const isAllCheck = useCallback(() => {
        if (check1 && check2 && check3) {
            dispatchCheck({ type: 'ALL_CHECK', check: true });
        } else if (!check1 || !check2 || !check3) {
            dispatchCheck({ type: 'ALL_CHECK', check: false });
        }
    }, [check1, check2, check3]);

    const updateAllCheck = (e) => {
        dispatchCheck({ type: 'ALL_CHECK', check: e.target.checked });
        dispatchCheck({ type: 'CHECK1', check: e.target.checked });
        dispatchCheck({ type: 'CHECK2', check: e.target.checked });
        dispatchCheck({ type: 'CHECK3', check: e.target.checked });
    };
    const onChangeCheck1 = (e) => {
        dispatchCheck({ type: 'CHECK1', check: e.target.checked });
    };
    const onChangeCheck2 = (e) => {
        dispatchCheck({ type: 'CHECK2', check: e.target.checked });
    };
    const onChangeCheck3 = (e) => {
        dispatchCheck({ type: 'CHECK3', check: e.target.checked });
    };

    useEffect(() => {
        setOverlap(false);
    }, [email]);

    useEffect(() => {
        updateToggle();
    }, [updateToggle]);

    useEffect(() => {
        matchPassword();
    }, [matchPassword]);

    useEffect(() => {
        isAllCheck();
    }, [isAllCheck]);

    useEffect(() => {
        onToggleCheck();
    }, [onToggleCheck]);

    const onClickSignUp = useCallback(async () => {
        if (isPasswordForm(password)) {
            try {
                // const res = await localRegister(email, password, password_confirm, check3);
                await localRegister(email, password, password_confirm, check3);
                history.push(`${Paths.ajoonamu.complete}/${email}`);
            } catch (e) {
                openModal('서버에 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
            }
        } else {
            openModal("비밀번호 형식에 맞지 않습니다!", '8자 이상으로 문자, 숫자 및 특수문자가 모두 포함되어야 합니다.', () => passwordInputRef.current.focus());
        }
    }, [history, email, password, password_confirm, check3, openModal]);

    const onClickOverlapCheck = useCallback(async () => {
        if (isEmailForm(email)) {
            try {
                const res = await localLogin(email);
                if (res.data.msg === '비밀번호가 틀렸습니다.') {
                    openModal('중복된 이메일입니다.', '다른 이메일로 시도해 주세요.');
                } else if(res.data.msg === '탈퇴한 이메일입니다.') {
                    openModal(res.data.msg, '다른 이메일로 시도해 주세요.');
                } else {
                    openModal('사용 가능한 이메일입니다.', '다음 절차를 계속하세요.');
                    setOverlap(true);
                }
            } catch (e) {
                openModal("서버에 오류가 발생하였습니다.", "잠시후 다시 시도해 주세요.");
            }
        } else {
            openModal('잘못된 이메일 형식입니다.', '이메일 형식을 확인해 주세요.');
        }
    }, [email, openModal]);

    const confirm = () => {
        if (password.length !== 0 || password_confirm.length !== 0) {
            if (compare) {
                return '비밀번호가 일치합니다.';
            } else {
                return '비밀번호가 불일치합니다.';
            }
        }
    };
    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <div className={styles['title']}>회원가입</div>
                <SignAuthInput
                    label={'이메일'}
                    inputType={'text'}
                    name={'email'}
                    initValue={email}
                    onChange={onChange}
                    onClick={onClickOverlapCheck}
                    button_disabled={overlap}
                    buttonTitle={'중복검사'}
                    reference={emailInputRef}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            onClickOverlapCheck();
                        }
                    }}
                />
                <div className={styles['divider']} />
                <SignNormalInput
                    label={'비밀번호'}
                    inputType={'password'}
                    name={'password'}
                    initValue={password}
                    onChange={onChange}
                    reference={passwordInputRef}
                />
                <SignNormalInput
                    inputType={'password'}
                    name={'password_confirm'}
                    initValue={password_confirm}
                    onChange={onChange}
                />
                <div
                    className={cx('compare', {
                        on: compare,
                        not_view:
                            password.length === 0 &&
                            password_confirm.length === 0,
                    })}
                >
                    <label>{confirm()}</label>
                </div>
                <AuthPhone
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    phoneAuth={phoneAuth}
                    setPhoneAuth={setPhoneAuth}
                />
                <AcceptContainer
                    {...check}
                    updateAllCheck={updateAllCheck}
                    onChangeCheck1={onChangeCheck1}
                    onChangeCheck2={onChangeCheck2}
                    onChangeCheck3={onChangeCheck3}
                />
                <div className={cx('btn', 'pd-box')}>
                    <Button
                        title={'가입하기'}
                        onClick={onClickSignUp}
                        toggle={toggle}
                        disable={!toggle}
                    ></Button>
                </div>
            </div>
        </div>
    );
};

const AcceptContainer = (props) => {

    const [title, setTitle] = useState('');
    const [open, setOpen] = useState(false);

    const agreeOpen = useCallback(t => {
        setTitle(t);
        setOpen(true);
    }, []);

    return (
        <div className={cx('agree')}>
            <div className={styles['const']}>이용약관</div>
            <div className={styles['terms']}>
                <div className={styles['all']}>
                    <CheckBox
                        id={'all'}
                        text={'모두 동의합니다.'}
                        check={props.allCheck}
                        onChange={props.updateAllCheck}
                    />
                </div>
                <div className={cx('pd-sub-top')}>
                    <div className={styles['chk-box']}>
                        <CheckBox
                            id={'check1'}
                            text={'개인정보처리방침 필수 동의'}
                            check={props.check1}
                            onChange={props.onChangeCheck1}
                            onClick={() => agreeOpen('개인정보처리방침')}
                        />
                    </div>
                    <div className={styles['chk-box']}>
                        <CheckBox
                            id={'check2'}
                            text={'이용약관 필수'}
                            check={props.check2}
                            onChange={props.onChangeCheck2}
                            onClick={() => agreeOpen('이용약관')}
                        />
                    </div>
                    <div className={styles['chk-box']}>
                        <CheckBox
                            id={'check3'}
                            text={'이벤트 알림 선택 동의'}
                            check={props.check3}
                            onChange={props.onChangeCheck3}
                        />
                    </div>
                    <div className={styles['sms']}>
                        <div className={styles['sub-text']}>
                            <label>
                                SMS, 이메일을 통해 할인/이벤트/쿠폰 정보를
                                받아보실 수 있습니다.
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <ShowAgree open={open} title={title} handleClose={() => setOpen(false)} />
        </div>
    );
};

export default SignUpContainer;
