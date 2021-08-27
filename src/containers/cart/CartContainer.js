
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Paths } from 'paths';
import styles from './Cart.module.scss';
import CartItemList from '../../components/cart/CartItemList';
import EstmModal from 'components/modal/EstmModal';
import PlusIcon from '../../components/svg/cart/PlusIcon';
import EqualsIcon from '../../components/svg/cart/EqualsIcon';
import CheckBox from '../../components/checkbox/CheckBox';
import Button from '../../components/button/Button';
import SquareCheckBox from '../../components/checkbox/SquareCheckBox';
import cn from 'classnames/bind';
import { ButtonBase } from '@material-ui/core';
import Loading from '../../components/assets/Loading';
import { useStore } from '../../hooks/useStore';
import { numberFormat ,numberToKorean} from '../../lib/formatter';
import Message from '../../components/assets/Message';
import { useModal } from '../../hooks/useModal';
import ScrollTop from '../../components/scrollTop/ScrollToTop';
import CntModal from '../../components/modal/QunaityModal';
import { getCartList, deleteCartItem,updateCartQunaity } from '../../api/cart/cart';
import { noAuthGetCartList, noAuthRemoveCartItem,noAuthUpdateCartQunaity } from '../../api/noAuth/cart';

import produce from 'immer';

const cx = cn.bind(styles);

const CartContainer = () => {
    const history = useHistory();
    const openModal = useModal();

    const user_token = useStore(false);

    const { company } = useSelector(state => state.company);
    const { addr1, lat, lng } = useSelector((state) => state.address);
    const [estmOpen, setEstmOpen] = useState(false);
    const [allChecked, setAllChecked] = useState(false); //전체선택
    const [estm, setEstm] = useState(true); //견적서 발송
    const [cartList, setCartList] = useState([]); //장바구니
    const [total, setTotal] = useState(0); //총 주문금액
    const [delivery_cost, setCost] = useState(0); // 주문 수량에 따른 배달비
    const [default_cost ,setDefaultCost] =useState(0); //기존 배달비
    const [loading, setLoading] = useState(false);
    const [cntOpen, setCntOpen] = useState(false);

    const [count, setCount] = useState(0); //모달 수량
    const [tempCartId, setCartId] = useState(-1);

    const onChangeCount = (e) => {
        const re = /^[0-9\b]+$/;
        // if value is not blank, then test the regex
        if (e.target.value === '' || re.test(e.target.value)) {
            setCount(e.target.value);
        }
    };

    //견적서 발송 여부
    const onChangeEstm = useCallback((e) => setEstm(true), []);
    const onChangeNotEstm = useCallback((e) => setEstm(false), []);

    const onClickEstmOpen = () => {
        if (total !== 0 && total >= company.minimum_order) {
            setEstmOpen(true);
        } else {
            openModal("최소 주문 금액을 채워주세요.", `최소 주문 금액은 ${numberFormat(company.minimum_order)}원입니다.`);
        }
    }
    const handleClose = () => setEstmOpen(false);

    //수량 변경 모달 띄우기
    const onClickCntChange = (item_quanity, cart_id) => {
        setCount(item_quanity);
        setCartId(cart_id);
        setCntOpen(true);
    };

    // 수량 변경 모달 닫기
    const onClickCloseCntModal = () => {
        setCntOpen(false);
    };

    //모달로 수량변경 하기
    const onSettingCount = useCallback(() => {
        const index = cartList.findIndex(
            ({ item }) => item.cart_id === tempCartId,
        );
        if (count !== '0' && count !== '') {
            setCartList(
                produce(cartList, (draft) => {
                    draft[index].item.item_quanity = parseInt(count);
                }),
            );
            setCntOpen(false);
            setCount(0);
            setCartId(-1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, cartList]);

    //수량 추가
    const handleIncrement = useCallback(
        (index) => {
            setCartList(
                produce(cartList, (draft) => {
                    draft[index].item.item_quanity++;
                }),
            );
        },
        [cartList],
    );

    //수량 감소
    const handleDecrement = useCallback(
        (index) => {
            setCartList(
                produce(cartList, (draft) => {
                    const item_quanity = draft[index].item.item_quanity;
                    if (item_quanity > 1) {
                        draft[index].item.item_quanity--;
                    }
                }),
            );
        },
        [cartList],
    );

    //장바구니 들고오기
    const getCartListApi = useCallback(async () => {
        //유저 정보가 있을때
        if (user_token) {
            setLoading(true);
            try {
                const res = await getCartList(user_token);
                if (res.data.msg === '선택된 배달받을 주소지가 없습니다.') {
                    openModal(res.data.msg, '주소지 설정을 해주세요.');
                    history.push(Paths.ajoonamu.address);
                } else {
                    const { query } = res.data;
                    let len = Object.keys(query).length;
                    let list = [];
                    for (let i = 0; i < len - 3; i++) {
                        list[i] = query[i];
                        list[i].checked = false;
                    }
                    setDefaultCost(query.delivery_cost);
                    setCartList(list);
                }
            } catch (e) {}
            setLoading(false);
        } else {
            setLoading(true);

            // 로컬스토리지 정보를 정확히 로드하기 위해 0.5초뒤 시작.
            setTimeout(async () => {
                setLoading(true);
                if (addr1) {
                    try {
                        const cart_id = JSON.parse(
                            localStorage.getItem('noAuthCartId'),
                        );
                        const res = await noAuthGetCartList(
                            cart_id,
                            lat,
                            lng,
                            addr1,
                        );
                        const { query } = res.data;
                        let len = Object.keys(query).length;
                        let list = [];
                        for (let i = 0; i < len - 1; i++) {
                            list[i] = query[i];
                            list[i].checked = false;
                        }
                        setDefaultCost(query.delivery_cost);
                        setCartList(list);
                    } catch (e) {}
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            }, 500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_token, addr1, lat, lng, history]);

    //장바구니 메뉴 삭제
    const handleDelete = useCallback(
        (cart_id) => {
            openModal(
                '이 상품을 삭제하시겠습니까?',
                '삭제를 원하시면 예를 눌러주세요.',
                async () => {
                    if (user_token) {
                        try {
                            await deleteCartItem(
                                user_token,
                                cart_id,
                            );
                            setCartList((list) =>
                                list.filter(
                                    ({ item }) =>
                                        cart_id.indexOf(item.cart_id) === -1,
                                ),
                            );
                        } catch (e) {

                        }
                    } else {
                        try {
                            await noAuthRemoveCartItem(cart_id);
                            const cart_ids = JSON.parse(
                                localStorage.getItem('noAuthCartId'),
                            );
                            const newState = cart_ids.filter(
                                (v) => parseInt(v) !== parseInt(cart_id),
                            );
                            localStorage.setItem(
                                'noAuthCartId',
                                JSON.stringify(newState),
                            );
                            setCartList((list) =>
                                list.filter(
                                    ({ item }) =>
                                        cart_id.indexOf(item.cart_id) === -1,
                                ),
                            );
                        } catch (e) {

                        }
                    }
                },
                true,
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user_token],
    );

    //선택한 메뉴 삭제
    const selectCartItemDelete = async () => {
        setLoading(true);

        let obj = [];
        //장바구니 리스트를 탐색
        for (let i = 0; i < cartList.length; i++) {
            const { checked, item } = cartList[i];
            // 선택된 아이템 푸쉬
            if (checked) obj.push(item.cart_id);
        }

        if (user_token) {
            try {
                //선택된 아이템이 없을시
                if (obj.length === 0) {
                    openModal('삭제할 상품을 선택해주세요.');
                }
                //선택된 아이템이 존재하면
                else {
                    openModal(
                        '이 상품을 삭제하시겠습니까?',
                        '삭제를 원하시면 예를 눌러주세요.',
                        async () => {
                            await deleteCartItem(user_token, obj);
                            setCartList((list) =>
                                list.filter((item) => item.checked === false),
                            );
                        },
                        true,
                    );
                }
            } catch (e) {
                
            }
        } else {
            //선택된 아이템이 없을시
            if (obj.length === 0) {
                openModal('삭제할 상품을 선택해주세요.');
            }
            //선택된 아이템이 존재하면
            else {
                openModal(
                    '이 상품을 삭제하시겠습니까?',
                    '삭제를 원하시면 예를 눌러주세요.',
                    async () => {
                        const cart_ids = JSON.parse( localStorage.getItem('noAuthCartId'));
                        const newState = cart_ids.filter(c => !obj.filter(o => o === c).length);

                        localStorage.setItem(
                            'noAuthCartId',
                            JSON.stringify(newState),
                        );
                        setCartList((list) =>
                            list.filter((item) => item.checked === false),
                        );
                    },
                    true,
                );
            }
        }
        setLoading(false);
    };

    //총 주문금액 변경
    const onChangeTotalPrice = useCallback(() => {
        let total = cartList.reduce((prev, { item }) => {
            const { item_price, item_quanity } = item;
            return prev + item_price * item_quanity;
        }, 0);

        for (let i = 0; i < cartList.length; i++) {
            const { options, item } = cartList[i];
            for (let j = 0; j < options.length; j++) {
                const { option_price } = options[j];
                total += option_price * item.item_quanity;
            }
        }

        setTotal(total);
    }, [cartList]);

    //전체 선택
    const onClickAllCheck = useCallback(
        (e) => {
            setAllChecked(e.target.checked);
            const newState = cartList.map((cart) => {
                return { ...cart, checked: e.target.checked };
            });
            setCartList(newState);
        },
        [cartList],
    );


    //단일 선택
    const onClickCheckChild = useCallback(
        (id) => {
            setCartList(
                produce(cartList, (draft) => {
                    draft[id].checked = !draft[id].checked;
                }),
            );
        },
        [cartList],
    );

    //전체 선택인지 아닌지 여부 판단
    const onCompareAllChecked = useCallback(() => {
        for (let i = 0; i < cartList.length; i++) {
            if (cartList[i].checked === false) {
                setAllChecked(false);
                return;
            }
        }
        setAllChecked(true);
        return;
    }, [cartList]);

    const onClickOrder = useCallback(async () => {
        if (total !== 0 && total >= company.minimum_order) {
            setLoading(true);
            if (user_token) {
                try {
                    for (let i = 0; i < cartList.length; i++) {
                        const { item } = cartList[i];
                        await updateCartQunaity(
                            user_token,
                            item.cart_id,
                            item.item_quanity,
                        );
                    }
                } catch (e) {
    
                }
            } else {
                try {
                    for (let i = 0; i < cartList.length; i++) {
                        const { item } = cartList[i];
                        await noAuthUpdateCartQunaity(
                            item.cart_id,
                            item.item_quanity,
                        );
                    }
                } catch (e) {
    
                }
            }
            setLoading(false);
            history.push(Paths.ajoonamu.order);
        } else {
            openModal("최소 주문 금액을 채워주세요.", `최소 주문 금액은 ${numberFormat(company.minimum_order)}원입니다.`);
        }
    }, [total, company.minimum_order, user_token, history, cartList, openModal]);
   


    useEffect(onChangeTotalPrice, [onChangeTotalPrice]);



    useEffect(() => {
        getCartListApi();
    }, [getCartListApi]);

    useEffect(()=>{
        if(company){
            const cost = (total>=company.free_cost_order) ? 0 : default_cost;
            setCost(cost);
        }
    },[total,default_cost,company])


    useEffect(() => {
        onCompareAllChecked();
    }, [onCompareAllChecked]);
    


    const render = () => {
        return (
            <ScrollTop>
                <div className={styles['container']}>
                    <div className={styles['title']}>장바구니</div>
                    {cartList.length !== 0 ? (
                        <>
                            <div className={styles['bar']}>
                                <div className={styles['check']}>
                                    <SquareCheckBox
                                        id={'allCheck'}
                                        text={'전체선택'}
                                        check={allChecked}
                                        onChange={onClickAllCheck}
                                    />
                                </div>
                                <ButtonBase
                                    className={styles['select']}
                                    onClick={selectCartItemDelete}
                                >
                                    선택삭제
                                </ButtonBase>
                            </div>
                            <div className={styles['cart-list']}>
                                <CartItemList
                                    allChecked={allChecked}
                                    carts={cartList}
                                    handleCheckChild={onClickCheckChild}
                                    handleIncrement={handleIncrement}
                                    handleDecrement={handleDecrement}
                                    handleDelete={handleDelete}
                                    handleOpen={onClickCntChange}
                                />
                            </div>
                            <div className={styles['finally']}>
                                <div className={styles['order-text']}>
                                    총 주문금액
                                </div>
                                <div className={styles['order-price']}>
                                    {numberFormat(total)}원
                                </div>
                                <div className={styles['box']}>
                                    <PlusIcon />
                                </div>
                                <div className={styles['order-text']}>
                                    배달비
                                </div>
                                <div className={styles['order-price']}>
                                    {numberFormat(delivery_cost)}원
                                </div>
                                <div className={styles['box']}>
                                    <EqualsIcon />
                                </div>
                                <div className={cx('order-price', 'total')}>
                                    {numberFormat(
                                        parseInt(delivery_cost) +
                                            parseInt(total),
                                    )}
                                    원
                                </div>
                            </div>
                            <div className={styles['order-text']}>
                                * 배달비는 거리에 따라 측정되며, {numberToKorean(company.free_cost_order)}원 이상
                                결제시 배달비는 무료입니다.
                            </div>
                            <div className={styles['estm-box']}>
                                <div className={styles['estm-title']}>
                                    견적서 발송 여부
                                </div>
                                <div className={styles['estm-check']}>
                                    <div className={styles['chk-box']}>
                                        <CheckBox
                                            id={'check1'}
                                            text={'견적서를 받고 싶습니다.'}
                                            check={estm}
                                            onChange={onChangeEstm}
                                        />
                                    </div>
                                    <div className={styles['chk-box']}>
                                        <CheckBox
                                            id={'check2'}
                                            text={
                                                '견적서를 받지 않아도 됩니다.'
                                            }
                                            check={!estm}
                                            onChange={onChangeNotEstm}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles['order-btn']}>
                                <Button
                                    onClick={estm ? onClickEstmOpen : onClickOrder}
                                    toggle={true}
                                    title={'주문하기'}
                                />
                            </div>
                            <EstmModal
                                cartList={cartList}
                                open={estmOpen}
                                dlvCost={delivery_cost}
                                handleClose={handleClose}
                                order={onClickOrder}
                            />
                        </>
                    ) : (
                        <Message
                            msg={'장바구니가 비었습니다.'}
                            buttonName={'주문하러 가기'}
                            size={600}
                            isButton={true}
                            onClick={() => history.push(Paths.ajoonamu.shop)}
                        />
                    )}
                </div>
                <CntModal
                    count={count}
                    onChange={onChangeCount}
                    open={cntOpen}
                    handleClose={onClickCloseCntModal}
                    onSetting={onSettingCount}
                />
            </ScrollTop>
        );
    };
    return (
        <div className={styles['load']}>
            {loading ? <Loading open={loading} /> : render()}
        </div>
    );
};
export default CartContainer;
