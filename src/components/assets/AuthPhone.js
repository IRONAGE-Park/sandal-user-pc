import React, { useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames/bind';
import { requestPostMobileAuth, requestPostMobileAuthCheck } from '../../api/auth/auth';
import { useModal } from '../../hooks/useModal';
import { isCellPhoneForm } from '../../lib/formatChecker';
import { Paths } from '../../paths';
import Check from 'components/svg/coupon/Check';
import SignAuthInput from '../sign/SignAuthInput';

import styles from './AuthPhone.module.scss';
import AuthTimer from './AuthTimer';

const cn = classnames.bind(styles);

export default ({ phoneNumber, setPhoneNumber, phoneAuth, setPhoneAuth, noLabel = false }) => {


    const phoneInputRef = useRef(null);
    const authInputRef = useRef(null);

    const openModal = useModal();
    const [authNumber, setAuthNumber] = useState('');
    const [auth, setAuth] = useState(false);

    const history = useHistory();

    const getMobileAuthNumber = useCallback(async () => {
        if (isCellPhoneForm(phoneNumber)) {
            try {
                const res = await requestPostMobileAuth(phoneNumber);
                if (res.data.msg === '실패!') {
                    // openModal('인증번호 발송에 실패했습니다.', '잠시 후 다시 시도해 주세요!');
                    alert('SMS not enough point. please charge.');
                } else {
                    setAuth(true);
                    openModal('인증번호가 성공적으로 발송되었습니다!', '인증번호를 확인 후 입력해 주세요!', () => authInputRef.current.focus());
                }
            } catch (e) {
                openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
                history.replace(Paths.index);
            }
        } else {
            openModal('휴대폰 형식에 맞지 않습니다!', '휴대폰 번호를 확인해 주세요.', () => phoneInputRef.current.focus());
        }
    }, [phoneNumber, openModal, history]);
    // 인증번호 재발송
    const onClickReSendAuth = () => {
        openModal('인증번호를 재전송 하시겠습니까?', '인증번호는 6자리입니다.', () => {
            setAuth(false);
            getMobileAuthNumber();
        }, true);
    };

    const sendMobileAuthNumber = useCallback(async () => {
        try {
            const res = await requestPostMobileAuthCheck(phoneNumber, authNumber);
            if (res.data.msg === '성공!') {
                openModal('성공적으로 인증되었습니다!', '절차를 계속 진행해 주세요.');
                setPhoneAuth(true);
                setAuth(false);
            } else {
                openModal('인증번호가 틀렸습니다!', '인증번호를 다시 한 번 확인해 주세요!', () => authInputRef.current.focus());
            }
        } catch (e) {
            openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
            history.replace(Paths.index);
        }
    }, [phoneNumber, authNumber, openModal, setPhoneAuth, history]);

    return (
        <>
            <SignAuthInput
                label={'휴대폰'}
                inputType={'number'}
                name={'phoneNumber'}
                initValue={phoneNumber}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        if (!phoneAuth) {
                            if (auth) {
                                onClickReSendAuth();
                            } else {
                                getMobileAuthNumber();
                            }
                        }
                    }
                }}
                reference={phoneInputRef}
                onChange={e => setPhoneNumber(e.target.value)}
                onClick={phoneAuth ? () => {} : auth ? onClickReSendAuth : getMobileAuthNumber}
                placeholder={'숫자만 입력해 주세요.'}
                buttonTitle={phoneAuth ? '인증 완료' : auth ? '인증번호 재발송' : '인증번호 발송'}
                input_disabled={auth || phoneAuth}
                noLabel={noLabel}
                button_disabled={phoneAuth}
            />
            <div className={cn('auth-btn', { not_view: !auth })}>
                <SignAuthInput
                    inputType={'number'}
                    initValue={authNumber}
                    name={'authNumber'}
                    onClick={sendMobileAuthNumber}
                    reference={authInputRef}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            if (auth) {
                                sendMobileAuthNumber();
                            }
                        }
                    }}
                    onChange={e => setAuthNumber(e.target.value)}
                    buttonTitle={'인증하기'}
                    noLabel={noLabel}
                    input_disabled={!auth}
                    button_disabled={!auth}
                />
                <div className={styles['timer']}>
                    {phoneAuth ? (<Check on={true} />) : auth && <AuthTimer start={auth} setStart={setAuth} />}
                </div>
            </div>
        </>
    );
};