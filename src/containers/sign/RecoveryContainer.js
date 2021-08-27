import React from 'react';
import styles from './Recovery.module.scss';
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
import FindIdIcon from 'components/svg/sign/find_id.svg';
import FindPwIcon from 'components/svg/sign/find_pw.svg';
import { ButtonBase } from '@material-ui/core';

const RecoveryContainer = () => {
    const history = useHistory();

    const onClickIdLink = () => {
        history.push(Paths.ajoonamu.recovery_id);
    };
    const onClickPwLink = () => {
        history.push(Paths.ajoonamu.recovery_pw);
    };

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <div className={styles['title']}>아이디/비밀번호 찾기</div>
                <div className={styles['link-box']}>
                    <div className={styles['item']} onClick={onClickIdLink}>
                        <FindBox
                            icon={FindIdIcon}
                            title={'아이디찾기'}
                            coment={'휴대폰 인증을 통해 아이디를 찾습니다.'}
                        />
                    </div>
                    <div className={styles['item']} onClick={onClickPwLink}>
                        <FindBox
                            icon={FindPwIcon}
                            title={'비밀번호 찾기'}
                            coment={
                                '자신의 아이디와 휴대폰 인증을 통해 비밀번호를 재설정합니다.'
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

function FindBox({ icon, title, coment }) {
    return (
        <ButtonBase className={styles['link-box']}>
            <div className={styles['icon']}>
                <img src={icon} alt="find" />
            </div>
            <div className={styles['table']}>
                <div className={styles['cell']}>
                    <div className={styles['main']}>{title}</div>
                    <div className={styles['coment']}>{coment}</div>
                </div>
            </div>
        </ButtonBase>
    );
}
export default RecoveryContainer;
