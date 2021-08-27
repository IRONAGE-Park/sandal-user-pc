import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import qs from 'querystring';
import { useHistory } from 'react-router-dom';
import styles from './EventContainer.module.scss';

import Noimage from '../../components/svg/noimage.png';

import { Paths } from '../../paths';
import { requestEventList, requestEventShow } from '../../api/event/event';
import Message from '../../components/assets/Message';
import { crossBrowsingDate, dateToYYYYMMDD, DBImageFormat } from '../../lib/formatter';
import { ButtonBase } from '@material-ui/core';
import { useModal } from '../../hooks/useModal';
import Loading from '../../components/assets/Loading';
import ListPaging from '../../components/sidebar/ListPaging';
import DetailPaging from '../../components/sidebar/DetailPaging';
import ErrorCoverImage from '../../components/assets/ErrorCoverImage';
import CoverImage from '../../components/assets/CoverImage';

const cn = classnames.bind(styles);

const PAGE_PER_VIEW = 6;


export default ({ match, location }) => {
    const search = location.search.replace('?', '');
    const query = qs.parse(search);

    const page = query.page ? parseInt(query.page) : 1;

    const history = useHistory();
    const openModal = useModal();

    // const [count, setCount] = useState(0);

    const [loading, setLoading] = useState(false);
    const [useList, setUseList] = useState([]);
    const [passedList, setPassedList] = useState([]);
    const [item, setItem] = useState({
        images: '[]'
    });
    const [mode, setMode] = useState(0);

    const detail = match.params.id !== undefined;

    const getEventList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await requestEventList(0, 1000);
            // const res = await requestEventList(PAGE_PER_VIEW, (page - 1) * PAGE_PER_VIEW);
            // if (count !== res.count) {
            //     setCount(res.count);
            // }

            if (res.events) {
                const today = new Date().getTime();

                const use = res.events.filter(event => {
                    const CB_start_date = crossBrowsingDate(event.start_date).getTime();
                    const CB_end_date = crossBrowsingDate(event.end_date).getTime();
                    return today >= CB_start_date && today <= CB_end_date;
                });
                const passed = res.events.filter(event => {
                    const CB_end_date = crossBrowsingDate(event.end_date).getTime();
                    return today > CB_end_date; 
                });
                setUseList(use);
                setPassedList(passed);
            }
        } catch (e) {
            openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
        }
        setLoading(false);
    //}, [openModal, page, count]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getEventShow = useCallback(async () => {
        setLoading(true);
        try {
            const res = await requestEventShow(match.params.id);
            if (res.event) {
                setItem(res.event);
            } else {
                openModal('지워지거나 없는 게시물입니다.', '다시 시도 해주세요.');    
                history.push(Paths.index);
            }
        } catch (e) {
            openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
        }
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match, history]);

    const onClickDetail = useCallback(id => history.push(`${Paths.ajoonamu.event}/${id}`), [history]);

    useEffect(() => {
        getEventList();
    }, [getEventList]);

    useEffect(() => {
        if (detail) {
            getEventShow();
            // return () => setItem({});
        }
    }, [detail, getEventShow]);
    return (
        <div className={styles['container']}>
            <div className={styles['title-area']}>
                <h2 className={styles['title']}>이벤트</h2>
                <div className={styles['mini-nav']}>
                    <span
                        onClick={() => { setMode(0); history.push(Paths.ajoonamu.event) }}
                        className={cn('mnav-item', { active: mode === 0 })}
                    >진행 중인 이벤트</span>
                    <span
                        onClick={() => { setMode(1); history.push(Paths.ajoonamu.event) }}
                        className={cn('mnav-item', { active: mode === 1 })}
                    >종료된 이벤트</span>
                </div>
            </div>
                <div className={cn('content', { margin: !detail })}>
                {detail ? (
                    <>
                        <div className={styles['c-title-area']}>
                            <h3 className={styles['c-title']}>{item.warn}</h3>
                            <p className={styles['c-enddate']}>
                                {dateToYYYYMMDD(item.end_date, '/')} 까지
                            </p>
                        </div>
                        <div className={styles['e-content']}>
                            <div className={styles['e-detail']}>
                                {item &&
                                item.images_detail &&
                                item.images_detail !== '[]' &&
                                DBImageFormat(item.images_detail).map(image_detail =>
                                <ErrorCoverImage src={image_detail} alt="상세 이미지" key={image_detail} />)}
                            </div>
                        </div>
                    </>
                ) : mode === 0 ? <EventListView list={useList} page={page} onClickDetail={onClickDetail} /> : <EventListView list={passedList} page={page} onClickDetail={onClickDetail} />}
            </div>
            {detail ? <DetailPaging baseURL={Paths.ajoonamu.event} idList={useList.map(item => item.id)} currentId={parseInt(match.params.id)} />
            : <ListPaging baseURL={Paths.ajoonamu.event} pagePerView={PAGE_PER_VIEW} currentPage={page} totalCount={useList.length} />}
            <Loading open={loading} />
        </div>
    );
};

const EventListView = ({ list, page, onClickDetail }) => (
    <>
        {list.length > 0 ? (
            list.slice((page - 1) * PAGE_PER_VIEW, page * PAGE_PER_VIEW).map(({ id, images, warn, end_date }) => {
                return (
                    <ButtonBase
                        onClick={() => onClickDetail(id)}
                        key={id}
                        className={styles['item']}
                    >
                        <div className={styles['image']}>
                            {(images === '[]') ? <img src={Noimage} alt="기본 이미지" />
                                : <CoverImage src={DBImageFormat(images)[0]} vertical_rate="60%" />}
                                {/* : <ErrorCoverImage src={DBImageFormat(images)[0]} alt="이벤트 이미지" />} */}
                        </div>
                        <div className={styles['text']}>
                            <p className={styles['warn']}>{warn}</p>
                            <p className={styles['enddate']}>
                                {dateToYYYYMMDD(end_date, '/')} 까지
                        </p>
                        </div>
                    </ButtonBase>
                );
            })) : (
                <Message src={false} msg={'조회된 이벤트가 없습니다 '} size={260} />
            )}
    </>
);