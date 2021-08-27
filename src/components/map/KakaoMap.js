import React, { useState, useEffect, useCallback } from 'react';
import Map from './Map';
import styles from './Map.module.scss';
import { searchIcon } from '../svg/header';
import { getStoreList } from '../../api/store/store';
import { stringToTel } from '../../lib/formatter';

import { ButtonBase, IconButton } from '@material-ui/core';
import { useModal } from '../../hooks/useModal';
import Loading from '../assets/Loading';
import Message from '../assets/Message';
import ListPaging from '../sidebar/ListPaging';

const PAGE_PER_VIEW = 5;

function KakaoMap() {

    const openModal = useModal();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [storeList, setStoreList] = useState([]);
    const [selectStore, setSelectStore] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(0);

    const onChangeSearch = (e) => setSearch(e.target.value);
    const onClickPage = useCallback(page => setCurrentPage(page), []);

    const onClickSearch = async () => {
        setLoading(true);
        try {
            const res = await getStoreList(search, (currentPage - 1) * PAGE_PER_VIEW, PAGE_PER_VIEW);
            const store_list = res.data.query;
            if (count !== res.data.query.count) {
                setCount(res.data.query.length);
            }
            // 처음꺼 선택하기
            const select_store = store_list.length ? store_list[0].shop_id : 0;
            setStoreList(store_list);
            setSelectStore(select_store);
            setCurrentPage(1);
        } catch (e) {
            openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
        }
        setLoading(false);
    };
    const handleChangeSelect = useCallback(id => setSelectStore(id), []);
    const onKeyPress = (e) => {
        // 눌려진 키가 Enter 면 handleCreate 호출
        if (e.key === 'Enter') {
            onClickSearch();
        }
    };

    useEffect(() => {
        onClickSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles['kakao-map']}>
            <Map storeList={storeList} selectStore={selectStore} />
            <div className={styles['map-area']}>
                <div className={styles['modal-area']}>
                    <div className={styles['modal']} data-aos="fade-up">
                        <h3 className={styles['title']}>지점찾기</h3>
                        <div className={styles['search-input']}>
                            <div className={styles['input']}>
                                <div style={{ position: 'relative' }}>
                                <input
                                    className={styles['search']}
                                    value={search}
                                    onChange={onChangeSearch}
                                    onKeyPress={onKeyPress}
                                />
                                <IconButton onClick={onClickSearch} className={styles['icon']}>
                                    <img src={searchIcon} alt="검색" />
                                </IconButton>
                                </div>
                                <p className={styles['count']}>
                                    총 <b>{storeList.length}개</b>의 지점을
                                    찾았습니다.
                                </p>
                                <div className={styles['list']}>
                                    <Loading open={loading} />
                                    {storeList.length !== 0 ?
                                        <StoreList storeList={storeList.slice((currentPage - 1) * PAGE_PER_VIEW, currentPage * PAGE_PER_VIEW)} handleClick={handleChangeSelect}/>
                                        : <Message msg="찾으시는 지점이 없습니다" size={200} />
                                    }
                                </div>
                                <ListPaging
                                    onClick={onClickPage}
                                    currentPage={currentPage}
                                    pagePerView={PAGE_PER_VIEW}
                                    totalCount={count}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StoreItem({ name, hp, addr1, handleClick }) {
    return (
        <ButtonBase className={styles['item']} onClick={handleClick}>
            <p className={styles['name']}>{name}</p>
            <p className={styles['location']}>{addr1}</p>
            <p className={styles['tel']}>{stringToTel(hp)}</p>
        </ButtonBase>
    );
}
function StoreList({ storeList, handleClick }) {
    const list = storeList.map(item => (
            <StoreItem
                name={item.shop_name}
                hp={item.shop_hp}
                addr1={item.shop_addr1}
                handleClick={() => handleClick(item.shop_id)}
                key={item.shop_id}
            />
        ));

    return <div className={styles['store-list']}>{list}</div>;
}
export default KakaoMap;
