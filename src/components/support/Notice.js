import React, { useCallback, useEffect, useState } from 'react';
import qs from 'querystring';
import styles from './Notice.module.scss';

import Message from '../assets/Message';
import { requestNoticeItem, requestNoticeList } from '../../api/support/notice';
import { Link, useHistory } from 'react-router-dom';
import { Paths } from '../../paths';
import { dateToRelative } from '../../lib/formatter';
import Loading from '../assets/Loading';
import { useModal } from '../../hooks/useModal';
import ListPaging from '../sidebar/ListPaging';
import DetailPaging from '../sidebar/DetailPaging';


const numbering = (number) => {
    let result = number;
    if (number < 100) {
        result = "0" + result;
    } if (number < 10) {
        result = "0" + result;
    }
    return result;
}

const PAGE_PER_VIEW = 5;

export default ({ match, location }) => {
    const search = location.search.replace('?', '');
    const query = qs.parse(search);

    const page = query.page ? parseInt(query.page) : 1;
    
    // const [count, setCount] = useState(0);

    const openModal = useModal();
    const [loading, setLoading] = useState(false);
    const [noticeList, setNoticeList] = useState([]);
    const [noticeItem, setNoticeItem] = useState({});
    const history = useHistory();

    const { params } = match;

    const getNoticeList = useCallback(async () => {
        setLoading(true);
        try {
            // const res = await requestNoticeList((page - 1) * PAGE_PER_VIEW, PAGE_PER_VIEW);
            const res = await requestNoticeList(0, 1000);
            // if (count !== res.count) {
            //     setCount(res.count);
            // }
            setNoticeList(res.notices);
        } catch (e) {
            openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
            history.replace(Paths.index);
        }
        setLoading(false);
    // }, [history, openModal, count, page]);
    }, [history, openModal]);

    const getNoticeItem = useCallback(async () => {
        setLoading(true);
        try {
            const res = await requestNoticeItem(parseInt(params.id));
            if (res.notice !== null && res.notice !== undefined) {
                setNoticeItem(res.notice);
            } else {
                openModal('없는 게시물입니다.', '게시글을 확인해 주세요.');
                history.replace(Paths.ajoonamu.support + '/notice');
            }
        } catch (e) {
            openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
            history.replace(Paths.index);
        }
        setLoading(false);
    }, [history, params, openModal]);

    useEffect(() => {
        getNoticeList();
    }, [getNoticeList]);

    useEffect(() => {
        if (params.id !== null && params.id !== undefined) {
            getNoticeItem();
        }
    }, [getNoticeItem, params]);

    return (
        <div className={styles['box']}>
            <div className={styles['table']}>
                { params.id !== null && params.id !== undefined ? 
                <NoticeContent item={noticeItem} />
                : noticeList.length > 0 ?
                <NoticeList list={noticeList.slice((page - 1) * PAGE_PER_VIEW, page * PAGE_PER_VIEW)} />
                : <Message src={false} msg={"등록된 공지사항이 없습니다."} size={260} />}
            </div>
            { params.id !== null && params.id !== undefined ?
            <DetailPaging baseURL={Paths.ajoonamu.support + '/notice'} idList={noticeList.map(item => item.id)} currentId={parseInt(params.id)} />
            : noticeList.length > 0 &&
            <ListPaging baseURL={Paths.ajoonamu.support + '/notice'} pagePerView={PAGE_PER_VIEW} currentPage={page} totalCount={noticeList.length} />}
            <Loading open={loading} />
        </div>
    );
};

const NoticeList = ({ list }) => list.map(item => (
    <div key={item.id} className={styles['column']}>
        <Link to={`${Paths.ajoonamu.support}/notice/${item.id}`} className={styles['row']}>
            <div className={styles['id']}>
                {numbering(item.id)}
            </div>
            <div className={styles['title']}>
                {item.title} 
            </div>
            <div className={styles['created']}>
                {dateToRelative(item.created_at, '/')}
            </div>
        </Link>
    </div>
));

const NoticeContent = ({ item }) => (
    <>
        <div className={styles['head']}>
            <div className={styles['id']}>
                {numbering(item.id)}
            </div>
            <div className={styles['title']}>
                {item.title}
            </div>
            <div className={styles['created']}>
                {dateToRelative(item.created_at, '/')}
            </div>
        </div>
        <div className={styles['content']} dangerouslySetInnerHTML={{ __html: item.body}} />
    </>
);