import React, { useState, useCallback, useEffect } from 'react';
import styles from './Find.module.scss';
import classNames from 'classnames/bind';
import Button from 'components/button/Button';
import { isPasswordForm } from '../../lib/formatChecker';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import { Paths } from '../../paths';
import { changePw } from '../../api/auth/auth';

const cx = classNames.bind(styles);

const FindPasswordContainer = () => {
    const history = useHistory();
    const openModal = useModal();
    const [state, setState] = useState({
        email: '', name: '', hp: ''
    });
    const [password, setPassword] = useState('');
    const [password_confirm, setPasswordConfirm] = useState('');
    const [compare, setCompare] = useState(false);

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };
    const onChangePasswordConfirm = (e) => {
        setPasswordConfirm(e.target.value);
    };

    //패스워드 매칭 체크
    const matchPassword = useCallback(() => {
        if (password.length !== 0 && password_confirm.length !== 0) {
            setCompare(password === password_confirm);
        } else {
            setCompare(false);
        }
    }, [password, password_confirm]);

    const confirm = () => {
        if (password.length !== 0 || password_confirm.length !== 0) {
            if (compare) {
                return '비밀번호가 일치합니다.';
            } else {
                return '비밀번호가 불일치합니다.';
            }
        }
    };
    const onClickChangePassword = useCallback(async () => {
        if (isPasswordForm(password)) {
            try {
                const { email, hp, name } = state;
                const res = await changePw(email, name, hp, password, password_confirm);
                if (res.data.msg) {
                    openModal('정상적으로 변경되었습니다!', '로그인 후 이용해주세요!');
                    history.push(Paths.ajoonamu.signin);
                } else {
                    openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
                }
            } catch (e) {
                openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
            }
        } else {
            openModal('형식에 맞지 않는 비밀번호입니다.', '8 ~ 10자 영문/숫자 조합으로 만들어 주세요.');
        }
    }, [state, password, password_confirm, history, openModal]);

    useEffect(() => {
        matchPassword();
    }, [matchPassword]);


    useEffect(() => {
        const sd = sessionStorage.getItem('find_item');
        if (sd !== null && sd !== undefined) {
            const { email, name, hp } = JSON.parse(sd);
            if (email && name && hp) {
                setState({ email, name, hp });
            } else {
                openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
                history.push(Paths.ajoonamu.recovery_pw);
            }
        } else {
            openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
            history.push(Paths.ajoonamu.recovery_pw);
        }
        return () => {
            sessionStorage.removeItem('find_item');
        }
    }, [openModal, history]);

    return (
        <>
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <div className={styles['title']}>비밀번호 찾기</div>
                    <div className={cx('box', 'pw')}>
                        <div className={styles['text']}>
                            인증이 완료되어 비밀번호를 재설정 합니다.
                            <br />
                            비밀번호를 잊어버리지 않게 주의하세요!
                        </div>
                    </div>
                    <div className={styles['input']}>
                        <input
                            type="password"
                            className={styles['change-input']}
                            placeholder="새로운 비밀번호"
                            value={password}
                            onChange={onChangePassword}
                        />
                        <input
                            type="password"
                            className={styles['change-input']}
                            placeholder="새로운 비밀번호 확인"
                            value={password_confirm}
                            onChange={onChangePasswordConfirm}
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
                    </div>
                    <Button
                        title={'비밀번호 변경 후 로그인'}
                        onClick={onClickChangePassword}
                        toggle={compare}
                    ></Button>
                </div>
            </div>
        </>
    );
};
export default FindPasswordContainer;
