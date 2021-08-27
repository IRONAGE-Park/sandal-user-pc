import React, { useCallback, useState } from 'react';
import styles from './Recovery.module.scss';
import SignNormalInput from 'components/sign/SignNormalInput';
import Button from 'components/button/Button';
import AuthPhone from '../../components/assets/AuthPhone';
import { findId } from '../../api/auth/auth';
import { useHistory } from 'react-router-dom';
import { Paths } from '../../paths';
import { useModal } from '../../hooks/useModal';

const RecoveryIdContainer = () => {

    const history = useHistory();
    const openModal = useModal();
    const [userName, setUserName] = useState('');
    const [phoneAuth, setPhoneAuth] = useState(false); //인증번호 성공
    const [phoneNumber, setPhoneNumber] = useState('');

    const onChangeName = (e) => setUserName(e.target.value);

    const sendFindId = useCallback(async () => {
        try {
            const res = await findId(userName, phoneNumber);
            const { msg, query } = res.data;
            if (msg === '성공') {
                sessionStorage.setItem('find_item', JSON.stringify({ email: query.user.email }));
                history.push(Paths.ajoonamu.find_email);
            } else {
                openModal('일치하는 아이디가 없습니다!', '정보를 다시 확인해 주세요.');
            }
        } catch (e) {
            openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
        }
    }, [userName, phoneNumber, history, openModal]);

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <div className={styles['title']}>아이디 찾기</div>
                <SignNormalInput
                    label={'이름'}
                    inputType={'text'}
                    initValue={userName}
                    onChange={onChangeName}
                />
                <div className={styles['divider']} />
                <AuthPhone
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    phoneAuth={phoneAuth}
                    setPhoneAuth={setPhoneAuth}
                />
                <div className={styles['btn']}>
                    <Button
                        title={'확인'}
                        onClick={sendFindId}
                        disable={!phoneAuth}
                        toggle={phoneAuth}
                    />
                </div>
            </div>
        </div>
    );
};

export default RecoveryIdContainer;
