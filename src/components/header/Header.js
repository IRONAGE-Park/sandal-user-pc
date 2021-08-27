import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Paths } from 'paths';
import styles from './Header.module.scss';
import { logo, storeIcon, locationIcon, searchIcon } from '../svg/header';

import styled from 'styled-components';
import { IconButton } from '@material-ui/core';

const TabLink = styled(NavLink)`
    text-decoration: none;
    cursor: pointer;
    color: #222;
    font-weight: normal;
    font-size: 1.333rem;
    &.active {
        font-weight: 500;
    }
`;

const HeadLink = styled(Link)`
    font-size: 1.833rem;
    font-weight: bold;
    color: #222;
    text-decoration: none;
`;

const Header = () => {
    const history = useHistory();
    const { user } = useSelector(state => state.auth);
    const { addr1 } = useSelector(state => state.address);
    const { store } = useSelector(state => state.store);
    const { company } = useSelector(state => state.company);

    const [logon, setLogon] = useState(false);
    const [search, setSearch] = useState('');

    const onChangeSearch = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    const onClickSearch = useCallback(() => {
        history.push(Paths.ajoonamu.search + '?query=' + search);
    }, [search, history]);

    useEffect(() => {
        setLogon(user);
    }, [user]);

    const onClickHome = () => history.push(Paths.index);
    const onClickAddr = () => history.push(Paths.ajoonamu.address);

    const {
        tab_one, tab_two, tab_three, tab_four, tab_five
    } = company;

    return (
        <div className={styles['header']}>
            <div className={styles['sub']}>
                <div className={styles['content']}>
                    <div className={styles['addr-store']}>
                        <div className={styles['info']}>
                            <img src={locationIcon} alt="배달" onClick={onClickAddr}/>
                            <div className={styles['text']} onClick={onClickAddr}>
                                {addr1 ? addr1 : '배달받으실 주소를 입력해주세요.'}
                            </div>
                            <img src={storeIcon} alt="배달"/>
                            <div className={styles['text']} onClick={() => { history.push(Paths.index); window.scrollTo(5000, 5000)}}>
                                {store ? store.shop_name : '샌달 지점 미설정'}
                            </div>
                        </div>
                        <div className={styles['auth']}>
                            {logon ? (
                                <>
                                    <TabLink
                                        className={styles['box']}
                                        to={Paths.ajoonamu.mypage}
                                    >
                                        내정보
                                    </TabLink>
                                    <TabLink
                                        className={styles['box']}
                                        to={Paths.ajoonamu.cart}
                                    >
                                        장바구니
                                    </TabLink>
                                    <TabLink
                                        className={styles['box']}
                                        to={Paths.ajoonamu.logout}
                                    >
                                        로그아웃
                                    </TabLink>
                                </>
                            ) : (
                                <>
                                    <TabLink
                                        className={styles['box']}
                                        to={Paths.ajoonamu.signin}
                                    >
                                        로그인
                                    </TabLink>
                                    <TabLink
                                        className={styles['box']}
                                        to={Paths.ajoonamu.cart}
                                    >
                                        장바구니
                                    </TabLink>
                                    <TabLink
                                        className={styles['box']}
                                        to={Paths.ajoonamu.signup}
                                    >
                                        회원가입
                                    </TabLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['header-nav']}>
                <div className={styles['header-menu']}>
                    <ul>
                        <li onClick={onClickHome}>
                            <img
                                className={styles['logo']}
                                alt={'로고'}
                                src={logo}
                            />
                        </li>
                        <li>
                            <HeadLink to={`${Paths.ajoonamu.event}/13`}>{tab_one}</HeadLink>
                        </li>
                        <li>
                            <HeadLink to={`${Paths.ajoonamu.shop}?tab=1`}>{tab_two}</HeadLink>
                        </li>
                        <li>
                            <HeadLink to={Paths.ajoonamu.breakfast}>{tab_three}</HeadLink>
                        </li>
                        <li>
                            <HeadLink to={Paths.ajoonamu.event}>{tab_four}</HeadLink>
                        </li>
                        <li>
                            <HeadLink to={Paths.ajoonamu.support}>{tab_five}</HeadLink>
                        </li>
                    </ul>
                </div>
                <div className={styles['header-input']}>
                    <div className={styles['input']}>
                        <input
                            className={styles['search']}
                            onChange={onChangeSearch}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && onClickSearch()
                            }
                        />
                        <IconButton
                            className={styles['icon']}
                            onClick={onClickSearch}
                        >
                            <img src={searchIcon} alt="검색" />
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
