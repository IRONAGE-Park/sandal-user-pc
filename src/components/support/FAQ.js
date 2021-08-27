import React, { useCallback, useEffect, useState } from 'react';
import qs from 'querystring';
import classnames from 'classnames/bind';

import styles from './FAQ.module.scss';

import Message from '../../components/assets/Message';

import DownArrow from '../svg/support/down.svg';
import { requestFAQList } from '../../api/support/faq';
import { useHistory } from 'react-router-dom';
import { Paths } from '../../paths';
import { dateToRelative } from '../../lib/formatter';
import { ButtonBase } from '@material-ui/core';
import Loading from '../assets/Loading';
import { useModal } from '../../hooks/useModal';
import ListPaging from '../sidebar/ListPaging';

const cn = classnames.bind(styles);

const faq_list = [
    { id: 0, value: '회원가입' },
    { id: 1, value: '쿠폰' },
    { id: 2, value: '결제' },
    { id: 3, value: '포인트' },
    { id: 4, value: '배달' },
    { id: 5, value: '문구 서비스' },
];

const PAGE_PER_VIEW = 5;

export default ({ location }) => {

    const search = location.search.replace('?', '');
    const query = qs.parse(search);

    const page = query.page ? parseInt(query.page) : 1;

    const openModal = useModal();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [quesCategory, setQuesCategory] = useState(0);
    const [selectOpen, setSelectOpen] = useState(false);
    const [list, setList] = useState([]);

    const [openIndex, setOpenIndex] = useState(-1);

    const handelSelectToggle = useCallback(() => setSelectOpen(!selectOpen), [
        selectOpen,
    ]);
    const onChangeCategory = useCallback((cate) => {
        setQuesCategory(cate);
    }, []);

    const handleChange = useCallback((index) => {
        if (openIndex !== index ) {
            setOpenIndex(index);
        } else {
            setOpenIndex(-1);
        }
    }, [openIndex]);

    const getFAQList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await requestFAQList(quesCategory);
            setList(res);
        } catch (e) {
            openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
            history.replace(Paths.index);
        }
        setLoading(false);
    }, [quesCategory, openModal, history]);

    useEffect(() => {
        getFAQList();
        setOpenIndex(-1);
    }, [getFAQList]);

    return (
        <div className={styles['box']}>
            <div className={styles['select']}>
                <p className={styles['q-title']}>궁금하신 질문의 유형을 선택해주세요.</p>
                <ButtonBase component="div" className={styles['select-box']} onClick={handelSelectToggle}>
                    <img className={styles['opener']} src={DownArrow} alt="더보기" />
                    <div className={styles['current']}>
                        <h5 className={styles['value']}>{faq_list[quesCategory].value}</h5>
                    </div>
                    <div className={cn('embed', { open: selectOpen })}>
                        {faq_list.map((item) => item.id !== quesCategory
                        &&  (<ButtonBase component="div" key={item.id} className={styles['s-area']}
                                onClick={() => onChangeCategory(item.id)}>
                                <div className={cn('selector')}>
                                    {item.value}
                                </div>
                            </ButtonBase>))}
                    </div>
                </ButtonBase>
            </div> 
            <div className={styles['table']}>
                {list.length > 0 ? (
                    list.slice((page - 1) * PAGE_PER_VIEW, page * PAGE_PER_VIEW).map((item, index) => (
                        <div key={item.id} className={cn('column', { open: openIndex === index })}>
                            <ButtonBase onClick={() => handleChange(index)} className={styles['row']}>
                                <div className={styles['question']}>{item.question}</div>
                                <div className={styles['created']}>{dateToRelative(item.created_at, '/')}</div>
                                <div className={styles['opener']}><img className={styles['direct']} src={DownArrow} alt="더보기" /></div>
                            </ButtonBase>
                            <div className={styles['answer']} dangerouslySetInnerHTML={{ __html: item.answer}} />
                        </div>
                    )) 
                ) : (<Message src={false} msg={'등록된 자주 묻는 질문이 없습니다.'} size={260} />)}
            </div>
            <ListPaging baseURL={Paths.ajoonamu.support + '/faq'} pagePerView={PAGE_PER_VIEW} currentPage={page} totalCount={list.length} />
            <Loading open={loading} />
        </div>
    );
};