import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Paths } from 'paths';
import styles from './Reserve.module.scss';
import cn from 'classnames/bind';
import TabMenu from '../../components/tab/TabMenu';
import MenuItemList from '../../components/item/MenuItemList';
import Message from 'components/assets/Message';
import PreferModal from '../../components/modal/PreferModal';
import { useHistory } from 'react-router';
import ShopBanner from '../../components/svg/shop/shop_banner.png';
import Loading from '../../components/assets/Loading';

import {
    getPreferMenuList,
    getMenuList,
} from '../../api/menu/menu';
import { getCategory } from '../../api/category/category';
import { get_catergory, get_menulist, add_menuitem } from '../../store/product/product';
import { stringNumberToInt } from '../../lib/formatter';
import { useScroll } from '../../hooks/useScroll';
import { ButtonBase } from '@material-ui/core';
import { IconButton } from '@material-ui/core';

import {
    get_prefer_list,
    get_general_list,
    set_type,
    set_serach,
    init
} from '../../store/product/prefer';

import {useModal} from '../../hooks/useModal';

const OFFSET = 12;
const LIMIT = 12;

const cx  = cn.bind(styles);

const ReserveContainer = ({ tab = '0' }) => {

    const openModal  = useModal();
    const { categorys, items } = useSelector((state) => state.product);
    const { addr1 } = useSelector((state) => state.address);
    const { store } = useSelector((state) => state.store);
    const { prefer_items, general_items, type, search } = useSelector(
        (state) => state.prefer,
    );
    const dispatch = useDispatch();

    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [budget, setBudget] = useState(0); // 맞춤 가격
    const [desireQuan, setDesireQuan] = useState(0); //희망수량
    const [tabIndex, setTab] = useState(parseInt(tab));
    const [loading, setLoading] = useState(false);

    const [preferEmpty, setPreferEmpty] = useState(false);
    const [generalEmpty, setGeneralEmpty] = useState(false);
    const onChangeType = (type) => dispatch(set_type(type));

    const { isScrollEnd } = useScroll(loading);
    const [posts, setPosts] = useState([]); //보여줄 배열
    const [isPaging, setIsPaging] = useState(false); //페이징중인지
    const [offset, setOffset] = useState(8);
    const handleOpen = () => setOpen(true); //test
    const handleClose = () => setOpen(false);

    const onChangeIndex = (e, index) => {
        setTab(index);
    };


    //추천메뉴 설정
    const onClickCustomOrder = async () => {
        setOpen(false);
        setLoading(true);
        try {
            const res = await getPreferMenuList(
                0,
                500,
                0,
                500,
                1,
                budget,
                desireQuan,
                addr1,
                store.shop_id,
            );
            if (res.items_prefer.length !== 0) {
                dispatch(get_prefer_list(res.items_prefer));
                setPreferEmpty(false);
            } else {
                setPreferEmpty(true);
            }
            if (res.items_general.length !== 0) {
                dispatch(get_general_list(res.items_general));
                setGeneralEmpty(false);
            } else {
                setGeneralEmpty(true);
            }
            dispatch(set_serach(true));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };
    const onClickInit = () => {
        openModal(
            '추천메뉴 설정을 다시하시겠습니까?',
            '재설정을 원하시면 예를 눌러주세요',
            () => {
                dispatch(init());
            },
            () => {},
            true,
        );
    };


    //전체 예산 입력
    const onChangeBudget = useCallback((e) => {
        const value = stringNumberToInt(e.target.value);
        setBudget(value);
    }, []);

    const onClickMenuItem = useCallback(
        (item_id) => {
            history.push(`${Paths.ajoonamu.product}?item_id=${item_id}`);
            sessionStorage.setItem('offset', offset);
        },
        [history, offset],
    );

    //첫 로딩시 메뉴 받아오기
    const getCategoryList = useCallback(async () => {
        setLoading(true);
        //카테고리 길이가 1이면 받아오기.
        if (categorys.length === 1) {
            const res = await getCategory();
            dispatch(get_catergory(res));
        }
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //첫 로딩시 메뉴 받아오기
    const getProductList = useCallback(async () => {
        setLoading(true);
        try {
            // 카테고리별로 메뉴 리스트 받아오기.
            let arr = [];
            if (categorys.length !== 1 && store && !items) {
                for (let i = 1; i < categorys.length; i++) {
                    const { ca_id } = categorys[i];
                    const result = await getMenuList(ca_id, 0, LIMIT, store.shop_id);
                    const temp = { ca_id: ca_id, items: result.data.query.items };
                    arr.push(temp);
                }
                dispatch(get_menulist(arr));
            }
        }
        catch (e) {
            
        }
        setLoading(false);
    }, [categorys, store, items, dispatch]);



    //오프셋이 바뀌었을때 페이지네이션으로 메뉴를 불러오는 함수.
    const PageNationMenuList = useCallback(async () => {
        if (!loading) {
            try {
                //현재 탭이 추천메뉴 탭이 아니고, 카테고리를 받아오고난뒤, 아이템과 스토어가  있으면 실행
                if (tabIndex !== 0 && categorys.length !== 1 && items && store) {
                    setIsPaging(true);
                    const res = await getMenuList(
                        categorys[tabIndex].ca_id,
                        offset,
                        LIMIT,
                        store.shop_id
                    );

                    const get_list = res.data.query.items;
                    if (get_list.length !== 0) {
                        setOffset(offset + LIMIT);
                        dispatch(
                            add_menuitem({
                                ca_id: categorys[tabIndex].ca_id,
                                items: get_list,
                            }),
                        );
                    }
                    setTimeout(() => {
                        setIsPaging(false);
                    }, 1000);
                }
            }
            catch (e) {
                
            }
        }
    }, [tabIndex, categorys, offset, items, loading, store, dispatch]);


    //첫 로딩시 카테고리 셋팅
    useEffect(() => {
        getCategoryList();
        window.scrollTo(0, 0);
    }, [getCategoryList]);

    // 첫 로딩시 메뉴 셋팅
    useEffect(() => {
        getProductList();
    }, [getProductList])

    //탭 바뀌었을때 오프셋 갱신
    useEffect(() => {
        setOffset(OFFSET);
    }, [tabIndex]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const url = JSON.parse(sessionStorage.getItem('url'));
            if (url) {
                //이전 페이지가 상품페이지라면 오프셋 유지.
                if (url.prev.indexOf('/product') !== -1) {
                    const OS = sessionStorage.getItem('offset');
                    if (OS) {
                        setOffset(parseInt(OS));
                    }
                }
            }
            setLoading(false);
        }, 100);
    }, []);

    //로딩 완료 되었을 때 스크롤 위치로 이동.
    useEffect(() => {
        const scrollTop = sessionStorage.getItem('scrollTop');
        const url = JSON.parse(sessionStorage.getItem('url'));
        if (url) {
            //이전 주소가 상품페이지라면 스크롤 유지
            if (url.prev.indexOf('/product') !== -1) {
                window.scrollTo(0, scrollTop);
            }
        }
    }, [loading]);

    useEffect(() => {
        if (desireQuan < 1) {
            setDesireQuan(1);
        }
    }, [desireQuan]);

    // 탭 인덱스로 URL 이동c
    useEffect(() => {
        history.replace(`${Paths.ajoonamu.shop}?menu=${tabIndex}`);
    }, [history, tabIndex]);

    //아이템과 인덱스가 변했을 시 보여줄 리스트 갱신.
    useEffect(() => {
        items && tabIndex !== 0 && setPosts(items[tabIndex - 1].items);
    }, [items, tabIndex]);

    //스크롤 끝과 페이징중인지 확인후 페이지네이션 실행.
    useEffect(() => {
        if (isScrollEnd && !isPaging) {
            PageNationMenuList();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScrollEnd]);

    const renderPost = useCallback(() => {
        return (
            <>
                {posts.length ? (
                    <MenuItemList
                        menuList={posts.slice(0, offset)}
                        onClick={onClickMenuItem}
                    />
                ) : (
                    <Message msg="배달 가능한 매장이 없거나 메뉴가 존재하지 않습니다." />
                )}
            </>
        );
    }, [posts, offset, onClickMenuItem]);

    return (
        <>
            {loading && <Loading open={loading} />}
            <div className={styles['banner']}>
                <img
                    className={styles['shop-banner']}
                    src={ShopBanner}
                    alt="banner"
                />
            </div>
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <div className={styles['title']}>예약주문 메뉴리스트</div>
                    {store ? <>
                        {categorys.length !== 1 && (
                            <TabMenu
                                tabs={categorys}
                                index={tabIndex}
                                onChange={onChangeIndex}
                            />
                        )}

                        <div className={styles['shop']}>
                            {tabIndex === 0 ? (
                                <>
                                        <PreferMenu
                                            empty={
                                                type === 0
                                                    ? preferEmpty
                                                    : generalEmpty
                                            }
                                            list={
                                                type === 0
                                                    ? prefer_items
                                                    : general_items
                                            }
                                            type={type}
                                            search={search}
                                            onClick={onClickMenuItem}
                                            handleOpen={handleOpen}
                                            onChange={onChangeType}
                                            init={onClickInit}
                                        />
                                </>
                            ) : (<>{renderPost()}</>)}
                        </div>
                        </>
                        : <Message
                            msg='주소지가 설정되지 않았습니다.'
                            src={true}
                            isButton={true}
                            buttonName={'주소지 설정하기'}
                            onClick={() => history.push(Paths.ajoonamu.address)}
                        />
                    }

                </div>
            </div>
            <PreferModal
                open={open}
                handleClose={handleClose}
                budget={budget}
                // endBudget={endBudget}
                onChangeBudget={onChangeBudget}
                // onChangeEndBudget={onChangeEndBudget}
                desireQuan={desireQuan} setDesireQuan={setDesireQuan}
                onClickCustomOrder={onClickCustomOrder}
            />
        </>
    );
};

const PreferMenu =({  
    empty,
    search,
    list,
    onClick,
    handleOpen,
    init,})=>{
    return(
        <>
        {!search ? (
            <>
                <Message
                    msg={`전체 예산과 희망 수량을 선택하시면\n 메뉴 구성을 추천 받으실 수 있습니다.`}
                    isButton={true}
                    onClick={handleOpen}
                    buttonName={'맞춤 주문 하기'}
                />
            </>
        ) : (
            <>
                <Refesh onClick={init} />
                {!empty ? (
                    <>
                        <div className={styles['length']}>
                            총 <b> {list.length}</b>개의 추천메뉴가
                            있습니다.
                        </div>
                        <MenuItemList menuList={list} onClick={onClick} />
                    </>
                ) : (
                    <Message
                        msg={`추천 드릴 메뉴 구성이 없습니다.`}
                        isButton={true}
                        onClick={handleOpen}
                        buttonName={'맞춤 주문 하기'}
                    />
                )}
            </>
        )}
    </>
    )
}

function Refesh({ onClick }) {
    return (
        <IconButton className={styles['refesh']} onClick={onClick}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#999">
                <path d="M13.5 2c-5.629 0-10.212 4.436-10.475 10h-3.025l4.537 5.917 4.463-5.917h-2.975c.26-3.902 3.508-7 7.475-7 4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5c-2.381 0-4.502-1.119-5.876-2.854l-1.847 2.449c1.919 2.088 4.664 3.405 7.723 3.405 5.798 0 10.5-4.702 10.5-10.5s-4.702-10.5-10.5-10.5z" />
            </svg>
        </IconButton>
    );
}

export default ReserveContainer;
