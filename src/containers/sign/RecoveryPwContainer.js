import React, { useState, useCallback } from 'react';
import styles from './Recovery.module.scss';
import SignNormalInput from 'components/sign/SignNormalInput';
import Button from 'components/button/Button';
import AuthPhone from '../../components/assets/AuthPhone';
import { Paths } from '../../paths';
import { findPw } from '../../api/auth/auth';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';


const RecoveryPwContainer = () => {
    
    const history = useHistory();
    const openModal = useModal();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneAuth, setPhoneAuth] = useState(false); //인증번호 성공

    const onChangeName = useCallback(e => setUserName(e.target.value), []);
    const onChangeEmail = useCallback(e => setUserEmail(e.target.value), []);

    const sendFindPw = useCallback(async () => {
        try {
            const res = await findPw(userName, phoneNumber, userEmail)
            const { msg } = res.data;
            if (msg === '성공') {
                sessionStorage.setItem('find_item', JSON.stringify({ email: userEmail, name: userName, hp: phoneNumber }));
                history.push(Paths.ajoonamu.find_password);
            } else {
                openModal('일치하는 아이디가 없습니다!', '정보를 다시 확인해 주세요.');
            }
        } catch (e) {
            openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
        }
    }, [userName, phoneNumber, userEmail, history, openModal]);


    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <div className={styles['title']}>비밀번호 찾기</div>
                <div className={styles['box']}>
                    <SignNormalInput
                        label={'이름'}
                        inputType={'text'}
                        initValue={userName}
                        onChange={onChangeName}
                    />
                    <div className={styles['small-divider']} />
                    <SignNormalInput
                        label={'이메일'}
                        inputType={'text'}
                        initValue={userEmail}
                        onChange={onChangeEmail}
                    />
                </div>
                <div className={styles['big-divider']} />
                <div className={styles['box']}>
                    <AuthPhone
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                        phoneAuth={phoneAuth}
                        setPhoneAuth={setPhoneAuth}
                    />
                </div>
                <div className={styles['btn']}>
                    <Button
                        title={'확인'}
                        onClick={sendFindPw}
                        disable={!phoneAuth}
                        toggle={phoneAuth}
                    />
                </div>
            </div>
        </div>
    );
};

export default RecoveryPwContainer;
