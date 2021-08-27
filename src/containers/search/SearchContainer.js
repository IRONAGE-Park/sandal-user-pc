import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import qs from 'querystring';
import styles from './SearchContainer.module.scss';
import { getSearchMenu } from '../../api/menu/menu';
import ListPaging from '../../components/sidebar/ListPaging';
import { Paths } from '../../paths';
import MenuItemList from '../../components/item/MenuItemList';
import { useHistory } from 'react-router-dom';
import Loading from '../../components/assets/Loading';
import Fail from '../../components/svg/search/Fail';
import { ButtonBase } from '@material-ui/core';
import Message from '../../components/assets/Message';

const PAGE_PER_VIEW = 8;

export default ({ location }) => {

    const { store } = useSelector((state) => state.store);
    const search = location.search.replace(/\?/g, '');
    const query = qs.parse(search);
    const q = query.query;
    const page = query.page ? parseInt(query.page) : 1;

    const [loading, setLoading] = useState(false);

    const history = useHistory();
    const [count, setCount] = useState(0);
    const [list, setList] = useState([]);

    const onClickMenuItem = useCallback((item_id) =>
        history.push(`${Paths.ajoonamu.product}?item_id=${item_id}`)
        , [history]);

    const getSearchResult = useCallback(async () => {
        setLoading(true);
        try {
            if (store) {
                const res = await getSearchMenu(q, (page - 1) * PAGE_PER_VIEW, PAGE_PER_VIEW, store.shop_id);
                if (res.data.msg === 'success') {
                    if (count !== res.data.query.count) {
                        setCount(res.data.query.count);
                    }
                    setList(res.data.query.items);
                } else if (res.data.msg === '메뉴가 존재하지 않습니다.') {
                    setCount(0);
                    setList([]);
                }
            }
        } catch (e) {

        }
        setLoading(false);
    }, [q, count, page, store]);

    useEffect(() => {
        getSearchResult();
    }, [getSearchResult]);

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                {store ?
                    <>
                        {!loading && (list.length ? (
                            <>
                                <div className={styles['search']}>
                                    <p className={styles['text']}><b>{q}</b>에 대한 {count}개의 검색결과</p>
                                    <MenuItemList
                                        menuList={list}
                                        onClick={onClickMenuItem}
                                    />
                                </div>
                                <ListPaging
                                    baseURL={Paths.ajoonamu.search + '?query=' + (q ? q : '')}
                                    currentPage={page}
                                    pagePerView={PAGE_PER_VIEW}
                                    totalCount={count}
                                />
                            </>
                        ) : (
                                <div className={styles['empty']}>
                                    <Fail />
                                    <p className={styles['text']}><b>{q}</b> 에 대한 검색결과가 없습니다.</p>
                                    <p className={styles['sub-text']}>다른 검색어를 입력하시거나 철자와 띄어쓰기를 확인해 보세요.</p>
                                    <ButtonBase className={styles['back-button']} onClick={() => history.push(Paths.index)}>
                                        돌아가기
                        </ButtonBase>
                                </div>
                            ))}

                    </> :

                    <Message
                        msg={
                            '주소지가 설정되지 않았습니다.'
                        }
                        src={true}
                        isButton={true}
                        buttonName={'주소지 설정하기'}
                        onClick={() => history.push(Paths.ajoonamu.address)}
                    />
                }

            </div>
            <Loading open={loading} />
        </div>
    );
};
