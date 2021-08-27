import React from 'react';
import classnames from 'classnames/bind';
import { IconButton } from '@material-ui/core';
import { Link } from "react-router-dom";
import styles from './ListPaging.module.scss';
import Prev from '../svg/paging/Prev';
import Next from '../svg/paging/Next';

const cn = classnames.bind(styles);

export default ({ baseURL, currentPage, pagePerView, totalCount, onClick }) => {
    const lastPage = Math.ceil(totalCount / pagePerView);
    let pageList = Array.from({ length: lastPage }, (v, i) => currentPage - 2 + i).splice(0, 5);
    if (pageList[0] <= 0) pageList = pageList.map(v => v + 1 - pageList[0]);
    else if (pageList[pageList.length - 1] >= lastPage) pageList = pageList.map(v => v + (lastPage - pageList[pageList.length - 1]));
    // 되긴 되네;

    const prev = parseInt(currentPage) - 1;
    const next = parseInt(currentPage) + 1;

    const connector = baseURL ? (baseURL.indexOf('?') !== -1 ? '&' : '?') : '?';

    return (
        <>
            {totalCount !== 0 && <div className={styles['paging']}>
                {onClick ?
                <LinkItem onClick={() => prev > 0 && onClick(prev)}>
                    <Prev />
                </LinkItem>
                : <LinkItem to={(prev > 0) && (baseURL + connector + 'page=' + prev)}>
                    <Prev />
                </LinkItem>}
                <ul className={styles['list']}>
                    {pageList.map(value => (
                        <li key={value} className={cn('number', { active: currentPage === value })}>
                            {onClick ?
                            <LinkItem onClick={() => onClick(value)}>
                                {value}
                            </LinkItem>
                            : <LinkItem to={baseURL + connector + 'page=' + value}>
                                {value}
                            </LinkItem>}
                        </li>
                    ))}
                </ul>
                {onClick ?
                <LinkItem onClick={() => next <= lastPage && onClick(next)}>
                    <Next />
                </LinkItem>
                : <LinkItem to={(next <= lastPage) && (baseURL + connector + 'page=' + next)}>
                    <Next />
                </LinkItem>}
            </div>}
        </>
    );
};

const LinkItem = ({ children, to, onClick }) => (
    <IconButton component='div' className={styles['button']} onClick={onClick}>
        {to ? <Link className={styles['link']} to={to}>
            {children}
        </Link> : children}
    </IconButton>
);