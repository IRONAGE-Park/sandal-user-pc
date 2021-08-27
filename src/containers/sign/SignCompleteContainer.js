import React from 'react';
import { Paths } from 'paths';
import styles from './Sign.module.scss';
import { useHistory } from 'react-router-dom';
import SignComplete from 'components/sign/SignComplete';
import Button from 'components/button/Button';
import cn from 'classnames/bind';

const cx = cn.bind(styles);

const str = (<>
    샌달 회원가입이 완료 되었습니다.<br />
    이메일 회원가입을 하신 회원님께서는<br />
    가입하신 이메일 주소로 지금 즉시 로그인이 가능합니다.
</>);

const SignCompleteContainer = ({ name }) => {
    //qurey로 이름 값 받아서 출력하기
    const history = useHistory();
    
    const goToLogin = () => {
        history.push(Paths.ajoonamu.signin);
    };
    return (
        <div className={styles['container']}>
            <div className={cx('content', 'complete')}>
                <div className={styles['title']}>회원가입 완료</div>
                <SignComplete
                    mainTitle={`축하합니다. ${name}님!`}
                    subTitle={str}
                />
                <div className={styles['btn']}>
                    <Button
                        title={'로그인'}
                        onClick={goToLogin}
                        toggle={true}
                    ></Button>
                </div>
            </div>
        </div>
    );
};

export default SignCompleteContainer;
