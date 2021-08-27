import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Paths } from 'paths';
import styles from './Detail.module.scss';
import AdditionalList from '../../components/item/AdditionalList';
import { useHistory } from 'react-router';
import OtherUserMenuItemList from '../../components/item/OtherUserMenuItemList';
import { getOtherUserMenu } from '../../api/menu/menu';
import TabMenu from '../../components/tab/TabMenu';
import Count from '../../components/svg/counter/Count';
import Noimage from '../../components/svg/noimage.png';
import { ButtonBase } from '@material-ui/core';
import Loading from '../../components/assets/Loading';
import { DBImageFormat, numberFormat, stringNumberToInt } from '../../lib/formatter';
import { addCartItem } from '../../api/cart/cart';
import { noAuthAddCart } from '../../api/noAuth/cart';
import { useStore } from '../../hooks/useStore';
import { getMenuInfo } from '../../api/menu/menu';
import { useModal } from '../../hooks/useModal';

import ScrollTop from '../../components/scrollTop/ScrollToTop';
import ErrorCoverImage from '../../components/assets/ErrorCoverImage';


const DetailContainer = ({ item_id }) => {
    const user_token = useStore(false);
    const openModal = useModal();
    const history = useHistory();
    const { addr1, lat, lng } = useSelector((state) => state.address);
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quanity, setQuanity] = useState(1);
    const [options, setOptions] = useState(null);
    const [option_total, setOptionTotal] = useState(0);

    const [other_menu_list, setOtherMenuList] = useState([]);
    const [index, setIndex] = useState(0);
    const onChangeIndex = (e, index) => setIndex(index);

    const getDetailMenu = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMenuInfo(item_id);
            if (res.item) {
                setMenu(res);
            } else {
                openModal('삭제되거나 없는 상품입니다.', '상품 번호를 다시 한 번 확인해 주세요.');
                history.push(Paths.ajoonamu.shop);
            }
        } catch (e) {
            openModal('잘못된 접근입니다.', '잠시 후 다시 시도해 주세요.');
            history.push(Paths.ajoonamu.shop);
        }
        setLoading(false);
    }, [item_id, openModal, history]);

    //다른사람이 본 메뉴
    const getOtherUserMenuApi = async () => {
        try {
            const res = await getOtherUserMenu();
            setOtherMenuList(res.data.query.items);
        } catch (e) {
            
        }
    };
    //장바구니 담기
    const onClickCart = useCallback(async () => {
        setLoading(true);
        if (user_token) {
            try {
                const res = await addCartItem(
                    user_token,
                    item_id,
                    options,
                    quanity,
                );
                if (res.data.msg === '성공') {
                    openModal(
                        '장바구니에 담았습니다.',
                        '장바구니로 이동하시겠습니까?',
                        () => {
                            history.push(Paths.ajoonamu.cart);
                        },
                        true,
                    );
                }
            } catch (e) {
                alert('Error!');
            }
        } else {
            try {
                //주소가 존재할 때
                if (addr1) {
                    try {
                        const res = await noAuthAddCart(
                            item_id,
                            options,
                            quanity,
                            lat,
                            lng,
                        );
                        const noAuthCartId = JSON.parse(
                            localStorage.getItem('noAuthCartId'),
                        );

                        if (res.data.msg === '성공') {
                            //이미 담은 cart_id가 존재할 경우
                            if (noAuthCartId) {
                                //기존 list에서 push
                                noAuthCartId.push(res.data.query);
                                //그리고 다시 저장
                                localStorage.setItem(
                                    'noAuthCartId',
                                    JSON.stringify(noAuthCartId),
                                );
                            } else {
                                // cart_id가 존재하지 않을 경우 배열의 형태로 push
                                localStorage.setItem(
                                    'noAuthCartId',
                                    JSON.stringify([res.data.query]),
                                );
                            }
                            openModal('장바구니에 담았습니다.', '장바구니로 이동하시겠습니까?',
                                () => history.push(Paths.ajoonamu.cart),
                                true,
                            );
                        }
                    } catch (e) {
                        
                    }
                } else {
                    openModal('배달지 주소가 설정되지 않았습니다.', '배달지 주소를 설정하시겠습니까?',
                        () => history.push(Paths.ajoonamu.address),
                        true,
                    );
                }
            } catch (e) {
                alert('Error!');
            }
        }
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, item_id, options, quanity, user_token, addr1, lat, lng]);

    //옵션아이템 클릭
    const setOptionItem = useCallback(() => {
        const add_option = menu.options
            .filter((option) => option.check)
            .map((option) => option.option_id);
        setOptions(add_option);
    }, [menu]);

    //수량 변경
    const onDecrement = useCallback(() => {
        if (quanity > 1) setQuanity(quanity - 1);
    }, [quanity]);

    const onIncrement = useCallback(() => {
        setQuanity(quanity + 1);
    }, [quanity]);

    //옵션 추가
    const onClickOptionItem = (id) => {
        const newOptionItem = menu.options.map((item) => {
            if (item.option_id === id) {
                item.check = !item.check;
                let option_price = item.option_price;
                let new_total = option_total;
                new_total += item.check ? option_price : option_price * -1;
                setOptionTotal(new_total);
            }
            return item;
        });
        setMenu({ ...menu }, { options: newOptionItem });
    };

    useEffect(() => {
        getDetailMenu();
    }, [getDetailMenu, item_id]);

    useEffect(() => {
        getOtherUserMenuApi();
    }, []);

    useEffect(() => {
        if (quanity < 1) {
            setQuanity(1);
        }
    }, [quanity])

    useEffect(() => {
        setQuanity(1);
        setOptions(null);
        setOptionTotal(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item_id]);

    useEffect(() => {
        menu && setOptionItem();
    }, [menu, setOptionItem]);


    return (
        <ScrollTop>
            <div className={styles['min-height']}>
                <div className={styles['container']}>
                    <div className={styles['menu-info']}>
                        <div className={styles['menu-view']}>
                            <ErrorCoverImage src={menu && menu.item.item_img !== "[]" ? DBImageFormat(menu.item.item_img)[0] : Noimage} alt={'메뉴'} />
                        </div>
                        <div className={styles['item-info']}>
                            <div className={styles['item-name']}>
                                {menu && menu.item.item_name}
                            </div>
                            <div className={styles['item-text']}>
                                {menu && menu.item.item_sub}
                            </div>
                            <div className={styles['item-price']}>
                                {menu && numberFormat(menu.item.item_price)}원
                            </div>
                            {menu && menu.options && menu.options.length !== 0 &&
                            <>
                                <div className={styles['option-text']}>
                                    추가선택
                                </div>
                                <div className={styles['item-additional-list']}>
                                    {menu && (
                                        <AdditionalList
                                            itemList={menu.options}
                                            onClickAddItem={onClickOptionItem}
                                        />
                                    )}
                                </div>
                            </>}
                            <div className={styles['box']}>
                                <div className={styles['counter']}>
                                    <input type="text" className={styles['value']} value={numberFormat(quanity)} onChange={e => setQuanity(stringNumberToInt(e.target.value))} />
                                    <div className={styles['control']}>
                                        <ButtonBase
                                            className={styles['increment']}
                                            onClick={onIncrement}
                                        >
                                            <Count plus={true} />
                                        </ButtonBase>
                                        <ButtonBase
                                            className={styles['decrement']}
                                            onClick={onDecrement}
                                        >
                                            <Count plus={false} />
                                        </ButtonBase>
                                    </div>
                                </div>
                                <div className={styles['btn']}>
                                    <ButtonBase onClick={onClickCart}>
                                        {menu &&
                                            `${quanity}개 담기(${numberFormat(
                                                (menu.item.item_price +
                                                    option_total) *
                                                    quanity,
                                            )}원)`}
                                    </ButtonBase>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['content']}>
                        {other_menu_list.length !== 0 &&
                        <><div className={styles['title']}>
                            추천 상품
                        </div>
                        <div className={styles['other-menu-list']}>
                            <OtherUserMenuItemList menu_list={other_menu_list} />
                        </div></>}
                        <div className={styles['detail-info']}>
                            <TabMenu
                                tabs={[
                                    { name: '상세정보' },
                                    { name: '영양성분표' },
                                ]}
                                index={index}
                                onChange={onChangeIndex}
                            />
                            {index === 0 && (
                            <div className={styles['detail-menu-view']}>
                                <div className={styles['detail-text']}>
                                    <div style={{ padding: '0 100px' }} className={styles['title']}>
                                        {menu && menu.item.item_name}
                                    </div>
                                    <div className={styles['sub-title']}>
                                        {menu && menu.item.item_sub}
                                    </div>
                                    <div className={styles['explan']}>
                                        {menu && menu.item.item_caution}
                                    </div>
                                </div>
                                <div className={styles['detail-img']}>
                                    {/* {company && <ErrorCoverImage src={DBImageFormat(company.item_content_top)[0]} alt="상단 랜딩 이미지" />} */}
                                    {menu &&
                                    menu.item &&
                                    menu.item.item_content !== '[]' &&
                                    DBImageFormat(menu.item.item_content).map(image =>
                                    <ErrorCoverImage src={image} alt="상세 이미지" key={image} /> )}
                                    {/* {company && <ErrorCoverImage src={DBImageFormat(company.item_content_bot)[0]} alt="상단 랜딩 이미지" />} */}
                                </div>
                            </div>
                            )}
                            {index === 1 && (
                            <div className={styles['detail-view']}>
                                <div className={styles['table']}>
                                    <Cell tr={'중량(g)'} td={menu && menu.item.option_1} />
                                    <Cell tr={'열량(kcal)'} td={menu && menu.item.option_2} />
                                    <Cell tr={'당류(g)'} td={menu && menu.item.option_3} />
                                    <Cell tr={'단백질(g)'} td={menu && menu.item.option_4} />
                                    <Cell tr={'포화지방(g)'} td={menu && menu.item.option_5} />
                                    <Cell tr={'나트륨(mg)'} td={menu && menu.item.option_6} />
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Loading open={loading} />
        </ScrollTop>
    );
};

function Cell({ tr, td }) {
    return (
        <div className={styles['cell']}>
            <div className={styles['tr']}>{tr}</div>
            <div className={styles['td']}>{td}</div>
        </div>
    );
}

export default DetailContainer;
