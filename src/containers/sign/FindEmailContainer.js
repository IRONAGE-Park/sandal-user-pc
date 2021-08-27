import React, { useEffect, useState } from 'react';
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
import styles from './Find.module.scss';
import Button from 'components/button/Button';
import { useModal } from '../../hooks/useModal';

const FindEmailContainer = () => {
    const openModal = useModal();    
    const history = useHistory();

    const [email, setEmail] = useState('');

    const onClickLogin = () => {
        history.push(Paths.ajoonamu.signin);
    };
    const onClickFindPw = () => {
        history.push(Paths.ajoonamu.recovery_pw);
    };

    useEffect(() => {
        const sd = sessionStorage.getItem('find_item');
        if (sd !== null && sd !== undefined) {
            const { email: findEmail } = JSON.parse(sd);
            if (findEmail) {
                setEmail(findEmail);
            } else {
                openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
                history.push(Paths.ajoonamu.recovery_id);
            }
        } else {
            openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
            history.push(Paths.ajoonamu.recovery_id);
        }
        return () => {
            sessionStorage.removeItem('find_item');
        }
    }, [openModal, history]);

    return (
        <>
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <div className={styles['title']}>아이디 찾기</div>
                    <div className={styles['box']}>
                        <div className={styles['text']}>
                            찾으시려는 이메일 주소는
                            <br />
                            <div className={styles['user']}>
                                {email}
                            </div>
                            입니다.
                        </div>
                    </div>
                    <div className={styles['btn']}>
                        <Button
                            title={'로그인'}
                            toggle={true}
                            onClick={onClickLogin}
                        ></Button>
                    </div>
                    <div className={styles['btn']}>
                        <div className={styles['item']} onClick={onClickFindPw}>
                            비밀번호 찾기
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default FindEmailContainer;
