import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Account.module.scss';
import classNames from 'classnames/bind';
import Select from 'components/svg/select/Select';
import { useStore } from '../../hooks/useStore';
import { stringToTel } from '../../lib/formatter';
import { ButtonBase } from '@material-ui/core';
import {
    requestAgreeChange,
    updateName,
    updatePassword,
    updatePhone,
} from '../../api/auth/auth';
import { useModal } from '../../hooks/useModal';
import Loading from '../../components/assets/Loading';
import MypagePhone from '../../components/mypage/MypagePhone';
import useInputs from '../../hooks/useInputs';
import { isPasswordForm } from '../../lib/formatChecker';
import { update_user_info } from '../../store/auth/auth';

const cx = classNames.bind(styles);

const AccountContainer = () => {
    const user_token = useStore();
    const openModal = useModal();
    const dispatch = useDispatch();
    
    const { user } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [passwordState, onChangePassword] = useInputs({
        pw_o: '',
        pw: '',
        pw_c: '',
    });
    const [passwordSame, setPasswordSame] = useState(true);
    const { pw_o, pw, pw_c } = passwordState;
    const [phone, setPhone] = useState('');
    const [emailAgree, setEmailAgree] = useState(0);
    const [smsAgree, setSMSAgree] = useState(0);

    const newPasswordInput = useRef(null);

    const [phoneAuth, setPhoneAuth] = useState(true);
    const [passwordChangeMode, setPasswordChangeMode] = useState(false);
    const [phoneChangeMode, setPhoneChangeMode] = useState(false);

    const [active, setActive] = useState(false);
    const confirm = useCallback(() => {
        if (pw.length !== 0 || pw_c.length !== 0) {
            return passwordSame
                ? '비밀번호가 일치합니다.'
                : '비밀번호가 불일치합니다.';
        }
    }, [pw, pw_c, passwordSame]);

    const onChangeEmailAgree = useCallback(() => {
        setEmailAgree(emailAgree === 0 ? 1 : 0);
    }, [emailAgree]);

    const onChangeSMSAgree = useCallback(() => {
        setSMSAgree(smsAgree === 0 ? 1 : 0);
    }, [smsAgree]);

    const sendPutAccount = useCallback(async () => {
        setLoading(true);
        try {
            if (passwordSame) {
                if (
                    !passwordChangeMode ||
                    (isPasswordForm(pw) && isPasswordForm(pw_c))
                ) {
                    if (phoneAuth) {
                        if (active) {
                            const errorList = [];
                            if (user.name !== name) {
                                const res = await updateName(user_token, name);
                                if (res.data.msg !== '성공') {
                                    errorList.push('이름');
                                } else {
                                    dispatch(
                                        update_user_info({
                                            name: 'name',
                                            value: name,
                                        }),
                                    );
                                }
                            }
                            if (passwordChangeMode) {
                                const res = await updatePassword(
                                    user_token,
                                    pw_o,
                                    pw,
                                    pw_c,
                                );
                                if (res.data.msg !== '성공') {
                                    errorList.push('비밀번호');
                                }
                            }
                            if (phoneChangeMode) {
                                const res = await updatePhone(
                                    user_token,
                                    phone,
                                );
                                if (res.data.msg !== '성공') {
                                    errorList.push('휴대폰 번호');
                                } else {
                                    dispatch(
                                        update_user_info({
                                            name: 'hp',
                                            value: phone,
                                        }),
                                    );
                                }
                            }
                            if (user.agree_mail !== emailAgree) {
                                const res = await requestAgreeChange(
                                    user_token,
                                    'mail',
                                    emailAgree,
                                );
                                if (res.data.msg !== '성공') {
                                    errorList.push('이메일 알림');
                                } else {
                                    dispatch(
                                        update_user_info({
                                            name: 'agree_mail',
                                            value: emailAgree,
                                        }),
                                    );
                                }
                            }
                            if (user.agree_sms !== smsAgree) {
                                const res = await requestAgreeChange(
                                    user_token,
                                    'sms',
                                    smsAgree,
                                );
                                if (res.data.msg !== '성공') {
                                    errorList.push('SMS 알림');
                                } else {
                                    dispatch(
                                        update_user_info({
                                            name: 'agree_sms',
                                            value: smsAgree,
                                        }),
                                    );
                                }
                            }
                            if (errorList.length) {
                                openModal(
                                    errorList.join(', ') +
                                        '를 변경하는데 오류가 발생했습니다.',
                                    '형식이나 인증을 확인한 후 다시 시도해 주세요.',
                                );
                            } else {
                                openModal(
                                    '정상적으로 정보가 변경되었습니다!',
                                );
                            }
                        } else {
                            openModal(
                                '변경된 정보가 없습니다!',
                                '정보를 변경하신 후에 시도해주세요.',
                            );
                        }
                    } else {
                        openModal(
                            '휴대폰 인증을 하지 않았습니다!',
                            '휴대폰 인증을 한 후에 재시도해 주세요.',
                        );
                    }
                } else {
                    openModal("비밀번호 형식에 맞지 않습니다!", '8자 이상으로 문자, 숫자 및 특수문자가 모두 포함되어야 합니다.', () => newPasswordInput.current.focus());
                }
            } else {
                openModal(
                    '비밀번호가 일치하지 않습니다!',
                    '새로 설정할 비밀번호를 확인한 후에 재시도해 주세요.',
                );
            }
        } catch (e) {
            openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
        }
        setLoading(false);
    }, [
        passwordSame,
        passwordChangeMode,
        pw,
        pw_c,
        phoneAuth,
        active,
        user,
        name,
        phoneChangeMode,
        emailAgree,
        smsAgree,
        user_token,
        dispatch,
        pw_o,
        phone,
        openModal,
    ]);

    useEffect(() => {
        if (user) {
            const { name, hp, agree_mail, agree_sms } = user;
            if (name) {
                setName(name);
            }
            if (hp) {
                setPhone(hp);
            }
            if (agree_mail) {
                setEmailAgree(agree_mail);
            }
            if (agree_sms) {
                setSMSAgree(agree_sms);
            }
        }
    }, [user]);

    useEffect(() => {
        setPasswordSame(pw === pw_c);
    }, [pw, pw_c]);
    useEffect(() => {
        if (user) {
            setActive(
                user.name !== name ||
                    passwordChangeMode ||
                    phoneChangeMode ||
                    (user.agree_mail !== 0) !== emailAgree ||
                    (user.agree_sms !== 0) !== smsAgree,
            );
        }
    }, [emailAgree, name, passwordChangeMode, phoneChangeMode, smsAgree, user]);

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <div className={styles['table']}>
                    <div className={styles['cell']}>
                        <div className={styles['label']}>이름</div>
                        <input
                            className={styles['user-input']}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles['cell']}>
                        <div className={styles['label']}>이메일</div>
                        <div className={styles['user-value']}>
                            {user && user.email}
                        </div>
                    </div>
                    {passwordChangeMode ? (
                        <>
                            <div className={cx('cell')}>
                                <div className={styles['label']}>
                                    현재 비밀번호
                                </div>
                                <input
                                    name="pw_o"
                                    type="password"
                                    className={styles['user-input']}
                                    value={pw_o}
                                    onChange={onChangePassword}
                                />
                            </div>
                            <div className={cx('cell')}>
                                <div className={styles['label']}>
                                    새 비밀번호
                                </div>
                                <input
                                    name="pw"
                                    type="password"
                                    ref={newPasswordInput}
                                    className={styles['user-input']}
                                    value={pw}
                                    onChange={onChangePassword}
                                />
                            </div>
                            <div className={cx('cell')}>
                                <div className={styles['label']}>
                                    새 비밀번호 확인
                                </div>
                                <input
                                    name="pw_c"
                                    type="password"
                                    className={styles['user-input']}
                                    value={pw_c}
                                    onChange={onChangePassword}
                                />
                            </div>
                            <div
                                className={cx('compare', {
                                    on: passwordSame,
                                    not_view:
                                        pw.length === 0 && pw_c.length === 0,
                                })}
                            >
                                <label>{confirm()}</label>
                            </div>
                        </>
                    ) : (
                        <div className={cx('cell', 'pd-bottom')}>
                            <div className={styles['label']}>비밀번호</div>
                            <ButtonBase
                                className={styles['user-change']}
                                onClick={() => {
                                    setPasswordChangeMode(true);
                                    setPasswordSame(false);
                                }}
                            >
                                변경하기
                            </ButtonBase>
                        </div>
                    )}

                    {phoneChangeMode ? (
                        <MypagePhone
                            phoneNumber={phone}
                            setPhoneNumber={setPhone}
                            phoneAuth={phoneAuth}
                            setPhoneAuth={setPhoneAuth}
                        />
                    ) : (
                        <>
                            <div className={styles['cell']}>
                                <div className={styles['label']}>
                                    휴대폰 번호
                                </div>
                                <div className={styles['user-value']}>
                                    {stringToTel(phone)}
                                </div>
                            </div>
                            <div className={cx('cell', 'pd-bottom')}>
                                <div className={styles['label']}></div>
                                <ButtonBase
                                    className={styles['user-change']}
                                    onClick={() => {
                                        setPhoneChangeMode(true);
                                        setPhoneAuth(false);
                                    }}
                                >
                                    변경하기
                                </ButtonBase>
                            </div>
                        </>
                    )}
                    <div className={cx('cell')}>
                        <div className={styles['label']}>알림설정</div>
                        <div
                            className={styles['user-value']}
                            onClick={onChangeEmailAgree}
                        >
                            <Select check={emailAgree !== 0} />
                            <span>
                                이메일을 통해 할인/이벤트/쿠폰 정보를 받아보실
                                수 있습니다.
                            </span>
                        </div>
                    </div>
                    <div className={cx('cell', 'line')}>
                        <div className={styles['label']}></div>
                        <div
                            className={styles['user-value']}
                            onClick={onChangeSMSAgree}
                        >
                            <Select check={smsAgree !== 0} />
                            <span>
                                SMS을 통해 할인/이벤트/쿠폰 정보를 받아보실 수
                                있습니다.
                            </span>
                        </div>
                    </div>
                    <div className={styles['btn']}>
                        <ButtonBase
                            className={styles['update']}
                            onClick={sendPutAccount}
                        >
                            내 정보 수정
                        </ButtonBase>
                    </div>
                </div>
            </div>
            <Loading open={loading} />
        </div>
    );
};

export default AccountContainer;
