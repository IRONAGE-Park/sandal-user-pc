import React from 'react';

import styles from './CardNews.module.scss';

import profileImage from '../svg/breakfast/card_image.png';
import Star from '../svg/home/Star';


export default ({ delay }) => {
    return (
        <div className={styles['card']} data-aos='fade-up' data-aos-delay={delay}>
            <div className={styles['profile']}>
                <img className={styles['image']} src={profileImage} alt="프로필" />
                <div className={styles['info']}>
                    <h3 className={styles['name']}>이*수 님</h3>
                    <p className={styles['major']}>유통회사 대표</p>
                </div>
            </div>
            <div className={styles['content']}>
                <p className={styles['text']}>
                    아침을 먹으며 직원들과 소통하니<br />
                    자연스럽게 회사 분위기도 좋아지고<br />
                    업무효율도 많이 좋아졌습니다.<br />
                    샌달은 계속 이용하려고 합니다.
                </p>
                <div className={styles['star']}>
                    <Star /><Star /><Star /><Star /><Star />
                </div>
            </div>
        </div>
    );
};