import React, { useCallback, useEffect, useState } from 'react';
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
import styles from './HomeContainer.module.scss';
import HomeSlick from './HomeSlick';
import MenuListView from '../../components/item/MenuListView';
import {
    bannerImg,
    backImg,
    orderServiceImg,
    templateImg,
} from '../../components/svg/home';
import cn from 'classnames/bind';
import { ButtonBase } from '@material-ui/core';

import KakaoMap from '../../components/map/KakaoMap';
import { getMainMenuList } from '../../api/menu/menu';
import Loading from 'components/assets/Loading';
import { getMainCategory } from '../../api/category/category';
import { requestGetReviewList } from '../../api/review/review';
import ReviewListView from '../../components/review/ReviewListView';
import ReviewModal from '../../components/modal/ReviewModal';

const cx = cn.bind(styles);

const HomeContainer = () => {
    const history = useHistory();
    const [useCate, setUseCate] = useState(0);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [reviewId, setReviewId] = useState(-1);
    const [reviewList, setReviewList] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleOpen = id => setReviewId(id);
    const handleClose = () => setReviewId(-1);

    const getProductList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMainCategory();
            // 카테고리를 분류 순서로 정렬.
            if (res[0]) {
                setUseCate(res[0].ca_id);
            }
            let arr = [];
            for (let i = 0; i < res.length; i++) {
                const result = await getMainMenuList(res[i].ca_id);
                const temp = { ca_id: res[i].ca_id, items: result };
                arr.push(temp);
            }
            setCategories(res);
            setItems(arr);
        } catch (e) {

        }
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getReviewList = useCallback(async () => {
        try {
            const res = await requestGetReviewList();
            if (res.data.msg === '성공') {
                setReviewList(res.data.query.reviews);
            } else {
                // 실패했을 때
            }
        } catch (e) {
            // 오류났을 때
        }
    }, []);

    const onClickDetailItem = useCallback(item_id => history.push(`${Paths.ajoonamu.product}?item_id=${item_id}`), [history]);

    useEffect(() => {
        getProductList();
    }, [getProductList]);

    useEffect(() => {
        getReviewList();
    }, [getReviewList]);

    return (
        <>
            <div className={styles['carousel']}>
                <HomeSlick />
            </div>
            <div className={styles['container']}>
                <Banner
                    title={'메뉴 추천 받아보기'}
                    subtitle={'샌달에서 간편하게 추천해드려요'}
                />
                <div className={styles['menu-list']}>
                    <ul className={styles['category']}>
                        {categories.map((category) => (
                            <li
                                key={category.ca_id}
                                onClick={() => setUseCate(category.ca_id)}
                                className={cx('item', {
                                    active: useCate === category.ca_id,
                                })}
                            >
                                <ButtonBase
                                    style={{
                                        fontSize: 'inherit',
                                        fontWeight: 'inherit',
                                        width: '100%',
                                        height: '100%',
                                        display: 'block',
                                        padding: '8px 25px',
                                    }}
                                >
                                    {category.ca_name}
                                </ButtonBase>
                            </li>
                        ))}
                    </ul>
                    <div className={styles['list-box']}>
                    {items.length && (
                        <MenuListView
                            menuList={items.find(item => item.ca_id === useCate).items}
                            onClick={onClickDetailItem}
                        />
                    )}
                    </div>
                </div>
                <div className={styles['banner-img']}
                    onClick={() => {
                        history.push(`${Paths.ajoonamu.shop}?tab=${0}`);
                        window.scrollTo(0, 0);
                    }}
                >
                    <img src={bannerImg} alt="배너" />
                </div>
                <div className={styles['order']}>
                    <div className={styles['box']} style={{ backgroundImage: 'url(' + backImg + ')' }} />
                    <div className={cx('box')}>
                        <div className={styles['service']}>
                            <div
                                className={styles['pd-box']}
                                data-aos="fade-up"
                            >
                                <div className={styles['title']}>
                                    기업조식 정기배송 서비스
                                </div>
                                <div className={styles['sub-title']}>
                                    샌달과 하루를 효율적으로 시작해보세요
                                </div>
                                <ButtonBase
                                    onClick={() => {
                                        history.push(
                                            `${Paths.ajoonamu.breakfast}`,
                                        );
                                        window.scrollTo(0, 0);
                                    }}
                                    className={styles['order-btn']}
                                >
                                    자세히보기
                                </ButtonBase>
                            </div>
                        </div>
                    </div>
                </div>
                <Banner
                    title={'샌달의 서비스'}
                    subtitle={'샌달은 고객님께 신선함까지 함께 배달해드려요'}
                />
                <div className={styles['service-box']}>
                    <ServiceBox title="익일 배달서비스 가능" subtitle="익일 배달서비스를 활용해보세요." image={templateImg} />
                    <ServiceBox title="도시락 무료 문구서비스 제공" subtitle="원하는 템플릿을 골라 정성과 마음을 전하세요." image={orderServiceImg} />
                </div>
                <Banner
                    title={'포토 리뷰'}
                    subtitle={'샌달을 이용해 주셨던 분들의 소중한 후기입니다.'}
                />
                <div className={styles['photo-review']}>
                    <ReviewListView
                        reviewList={reviewList}
                        onClick={handleOpen}
                    />
                </div>
                <KakaoMap />
            </div>
            <Loading open={loading} />
            <ReviewModal open={reviewId !== -1} handleClose={handleClose} id={reviewId} />
        </>
    );
};

const ServiceBox = ({ title, subtitle, image }) => (
    <div className={styles['service-type']}>
        <div className={styles['box']} data-aos="fade-up">
            <img
                className={styles['box-img']}
                alt="serviceBox"
                src={image}
            />
            <div className={styles['box-text']}>
                <div className={styles['title']}>{title}</div>
                <div className={styles['sub-title']}>{subtitle}</div>
            </div>
        </div>
    </div>
);

const Banner = ({ title, subtitle, text }) => (
    <div className={styles['banner']}>
        <div className={styles['title']}>{title}</div>
        <div className={styles['sub-title']}>{subtitle}</div>
        <div className={styles['text']}>{text}</div>
    </div>
);

export default HomeContainer;
