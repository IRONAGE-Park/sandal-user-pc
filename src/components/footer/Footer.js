/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import styles from './Footer.module.scss';
import { Fb_Icon, Insta_Icon, Blog_Icon, YouTube_Icon, Kakao_Icon } from '../svg/footer';
import { NavLink } from 'react-router-dom';
import { Paths } from '../../paths';
import { IconButton } from '@material-ui/core';
import { useSelector } from 'react-redux';

const Footer = () => {
    const { company } = useSelector(state => state.company);
    const {
        com_name,
        business_num,
        tel,
        ceo_name,
        cybertrade_num,
        addr1,
        addr2,
        sns_facebook,
        sns_insta,
        sns_naverblog,
        sns_kakao,
        sns_youtube
    } = company;

    return (
        <div className={styles['footer']}>
            <div className={styles['content']}>
                <div className={styles['title']}>
                    <div className={styles['tos']}>
                        <div className={styles['text1']}>
                            <NavLink activeStyle={{ color: '#222', fontWeight: 'bold' }} to={Paths.ajoonamu.policy}>개인정보처리방침</NavLink>
                            <NavLink activeStyle={{ color: '#222', fontWeight: 'bold' }} to={Paths.ajoonamu.term_use}>이용약관</NavLink>
                        </div>
                    </div>
                    <div className={styles['sns']}>
                        <Icon src={Fb_Icon} alt={'fb'} href={sns_facebook} />
                        <Icon src={Insta_Icon} alt={'insta'} href={sns_insta} />
                        <Icon src={Blog_Icon} alt={'blog'} href={sns_naverblog} />
                        <Icon src={YouTube_Icon} alt={'youtube'} href={sns_youtube} />
                        <Icon src={Kakao_Icon} alt={'kakao'} href={sns_kakao} />
                    </div>
                </div>
                <div className={styles['context']}>
                    <div className={styles['contact-table']}>
                        <div className={styles['cell']}>
                            <div className={styles['text']}>입점문의 무료상담</div>
                            <div className={styles['number']}>{tel}</div>
                        </div>
                        <div className={styles['cell']}>
                            <p className={styles['support']}>
                                <span className={styles['have-divider']}>
                                    고객센터 전화번호 : {tel}
                                </span>
                                <span>
                                    고객센터 운영시간 : 평일 am 9:00 ~ pm 5:00
                                </span>
                            </p>
                            <p className={styles['info']}>
                                <span className={styles['have-divider']}>
                                    업체명 : {com_name}
                                </span>
                                <span className={styles['have-divider']}>
                                    대표자명 : {ceo_name}
                                </span>
                                <span className={styles['have-divider']}>
                                    사업자등록번호: {business_num}{' '}
                                </span>
                                <span>통신판매업신고번호: {cybertrade_num}</span>
                            </p>
                            <p className={styles['address']}>
                                주소: {addr1 + ' ' + addr2}
                            </p>
                            <p className={styles['copyright']}>
                                Copyright © Sandal Corp. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
const Icon = ({ src, alt, href }) => (
    <IconButton component="a" href={href} target="_blank" className={styles['icon-button']}>
        <img src={src} alt={alt} />
    </IconButton>
);

export default Footer;
