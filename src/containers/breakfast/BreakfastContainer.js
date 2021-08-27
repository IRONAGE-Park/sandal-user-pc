import React from 'react';
import classnames from 'classnames/bind'
import styles from './BreakfastContainer.module.scss';

import MenuSlick from '../../components/breakfast/MenuSlick';

import backgroundBanner from '../../components/svg/breakfast/banner.png';
import welfare1 from '../../components/svg/breakfast/welfare_1.png';
import welfare2 from '../../components/svg/breakfast/welfare_2.png';
import welfare3 from '../../components/svg/breakfast/welfare_3.png';

import order1 from '../../components/svg/breakfast/order1.svg';
import order2 from '../../components/svg/breakfast/order2.svg';
import order3 from '../../components/svg/breakfast/order3.svg';
import order4 from '../../components/svg/breakfast/order4.svg';
import order5 from '../../components/svg/breakfast/order5.svg';
import order6 from '../../components/svg/breakfast/order6.svg';
import menuArrow from '../../components/svg/breakfast/arrow.svg';


import { useHistory } from 'react-router-dom';
import { ButtonBase } from '@material-ui/core';

import { Paths } from '../../paths';
// import Column from '../../components/breakfast/Column';
import CardNews from '../../components/breakfast/CardNews';


const cn = classnames.bind(styles);

const BreakfastContainer = () => {
    const history = useHistory();

    return (
        <div className={styles['breakfast']}>
            <div className={styles['banner']} style={{ backgroundImage: 'url(' + backgroundBanner + ')'}}>
                <div className={styles['content']} data-aos='fade-up'>
                    <p className={styles['title']}>든든한 하루의 시작</p>
                    <p className={styles['text']}>샌달 기업조식 서비스.</p>
                    <div className={styles['button-area']}>
                        <ButtonBase onClick={() => { history.push(Paths.ajoonamu.breakfast + '/menu'); window.scrollTo(0, 0) }}
                            className={cn('button', 'green')}>
                            메뉴보기
                        </ButtonBase>
                        <ButtonBase onClick={() => history.push(Paths.ajoonamu.support + '/qna/write')} className={cn('button', 'white', 'grid')}>
                            문의하기
                        </ButtonBase>
                    </div>
                </div>
            </div>
            <div className={styles['area']}>
                <div className={cn('container', 'welfare')}>
                    <h3 className={styles['title']}>매일 아침 도착하는 조식 복지</h3>
                    <div className={styles['content']}>
                        <div className={styles['item']} data-aos='fade-up' data-aos-delay="200">
                            <div className={styles['box']}>
                                <img className={styles['image']} src={welfare1} alt="조식" />
                                <div className={styles['text']}>
                                    <h5 className={styles['intro']}>매일 신선하게</h5>
                                    <div className={styles['sub']}>
                                        <p>샌달은 매일 새벽 직접 생산한</p>
                                        <p>샌드위치를 신속하게 배송합니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['item']} data-aos='fade-up' data-aos-delay="600">
                            <div className={styles['box']}>
                                <img className={styles['image']} src={welfare2} alt="조식" />
                                <div className={styles['text']}>
                                    <h5 className={styles['intro']}>매달 새롭게</h5>
                                    <div className={styles['sub']}>
                                        <p>메뉴 선호도 조사와 다양한 메뉴 개발을</p>
                                        <p>통해 새로운 식단을 제공합니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['item']} data-aos='fade-up' data-aos-delay="400">
                            <div className={styles['box']}>
                                <img className={styles['image']} src={welfare3} alt="조식" />
                                <div className={styles['text']}>
                                    <h5 className={styles['intro']}>항상 건강하게</h5>
                                    <div className={styles['sub']}>
                                        <p>신뢰할 수 있는 재료로 건강과 위생을</p>
                                        <p>생각하며 안전하게 만듭니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['divider']} />
            <div className={styles['area']}>
                <div className={cn('container', 'diet')}>
                    <h3 className={styles['title']}>간단하게 준비하는 맞춤식단</h3>
                    <div className={styles['content']}>
                        <ul className={styles['list']}>
                            <li className={styles['item']} data-aos='fade-up' data-aos-delay="200">
                                <img src={order1} alt="맞춤식단" />
                                <p className={styles['text']}>맞춤상담</p>
                            </li>
                            <img className={styles['arrow']} src={menuArrow} alt="다음" />
                            <li className={styles['item']} data-aos='fade-up' data-aos-delay="400">
                                <img src={order2} alt="맞춤식단" />
                                <p className={styles['text']}>메뉴구성</p>
                            </li>
                            <img className={styles['arrow']} src={menuArrow} alt="다음" />
                            <li className={styles['item']} data-aos='fade-up' data-aos-delay="600">
                                <img src={order3} alt="맞춤식단" />
                                <p className={styles['text']}>식단확인</p>
                            </li>
                            <img className={styles['arrow']} src={menuArrow} alt="다음" />
                            <li className={styles['item']} data-aos='fade-up' data-aos-delay="800">
                                <img src={order4} alt="맞춤식단" />
                                <p className={styles['text']}>새벽배송</p>
                            </li>
                            <img className={styles['arrow']} src={menuArrow} alt="다음" />
                            <li className={styles['item']} data-aos='fade-up' data-aos-delay="1000">
                                <img src={order5} alt="맞춤식단" />
                                <p className={styles['text']}>조식섭취</p>
                            </li>
                            <img className={styles['arrow']} src={menuArrow} alt="다음" />
                            <li className={styles['item']} data-aos='fade-up' data-aos-delay="1200">
                                <img src={order6} alt="맞춤식단" />
                                <p className={styles['text']}>피드백/개선</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles['divider']} />
            <div className={styles['area']}>
                <div className={cn('container', 'varies')}>
                    <div className={styles['content']}>
                        <div className={styles['slider']}>
                            <MenuSlick />
                        </div>
                        <SideButtonArea
                            text="매달 업데이트 되는"
                            keyText="다양한 메뉴"
                            green
                            buttonText="더 많은 메뉴 보기"
                            onClick={() => { history.push(Paths.ajoonamu.breakfast + '/menu'); window.scrollTo(0, 0) }}
                        />
                    </div>
                </div>
            </div>
            <div className={styles['area']} style={{ backgroundColor: '#FEDE22'}}>
                <div className={cn('container', 'special')}>
                    <div className={styles['content']}>
                        <div className={styles['card-news']}>
                            <div className={cn('card', 'left')}>
                                <CardNews delay={200}/>
                            </div>
                            <div className={cn('card', 'center')}>
                                <CardNews delay={600}/>
                            </div>
                            <div className={cn('card', 'right')}>
                                <CardNews delay={400}/>
                            </div>
                        </div>
                        <SideButtonArea
                            text="00명의 고객들이 말하는"
                            keyText="샌달 조식의 특별함"
                            right
                            buttonText="맞춤식단 상담하기"
                            onClick={() => history.push(Paths.ajoonamu.support + '/qna/write')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BreakfastContainer;


const SideButtonArea = ({ right, text, keyText, green, buttonText, onClick }) => (
    <div className={cn('side-button-area', { right })}>
        <div data-aos={right ? "fade-right" : "fade-left"}>
            <p className={styles['text']}>{text}</p>
            <p className={styles['key-text']}>{keyText}</p>
            <ButtonBase style={{ width: '300px', height: '64px', fontWeight: 500 }}
                className={cn('button', { green })}
                onClick={onClick}>
                {buttonText}
            </ButtonBase>
        </div>
    </div>
);