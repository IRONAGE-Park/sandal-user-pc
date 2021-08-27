import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './HomeSlick.module.scss';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { requestBannerList } from '../../api/event/banner';
import { useModal } from '../../hooks/useModal';
import { IconButton } from '@material-ui/core';

// import NoImage from '../../components/svg/noimage.png';

import { DBImageFormat } from '../../lib/formatter';
import ErrorCoverImage from '../../components/assets/ErrorCoverImage';

import Prev from '../../components/svg/menu/prev.svg';
import Next from '../../components/svg/menu/next.svg';

const arrowStyle = {
    cursor: 'pointer',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '64px',
    height: '64px',
    top: '50%',
    transform: 'translateY(-50%)',
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
    zIndex: 1000,
};




const NextArrow = ({ style, onClick }) => (
    <IconButton
        style={{
            ...style,
            ...arrowStyle,
            right: '20px',
        }}
        onClick={onClick}
    >
        <img
            style={{ display: 'block', width: '32px', height: '32px' }}
            src={Next}
            alt="next"
        />
    </IconButton>
);

const PrevArrow = ({ style, onClick }) => (
    <IconButton
        style={{
            ...style,
            ...arrowStyle,
            left: '20px',
        }}
        onClick={onClick}
    >
        <img
            style={{ display: 'block', width: '32px', height: '32px' }}
            src={Prev}
            alt="prev"
        />
    </IconButton>
);



const HomeSlick = () => {

    const settings = {
        infinite: true,
        autoplay: true,
        speed: 3000,
        draggable:false,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        initialSlide: 0,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const openModal = useModal();
    const slider = useRef();
    const [list, setList] = useState([]);
    const getBannerList = useCallback(async () => {
        try {
            const res = await requestBannerList();
            if (res.data.msg === '성공') {
                setList(res.data.query);
            } else {
                openModal('배너를 가지고 오는데 오류가 발생했습니다.', '페이지를 새로고침 해 주세요.');
            }
        } catch (e) {
            openModal('배너를 가지고 오는데 오류가 발생했습니다.', '페이지를 새로고침 해 주세요.');
        }
    }, [openModal]);
    
    useEffect(() => {
        getBannerList();
    }, [getBannerList]);

    return (
        <div className={styles['container']}>
            {list.length !== 0 && 
            <Slider {...settings} ref={slider}>
                {list.map(item => (
                    (item.bn_url.indexOf('http://') !== -1 || item.bn_url.indexOf('https://') !== -1 ?
                    (item.bn_url.indexOf('ajoonamu.com') === -1 ?
                    <a key={item.id} href={item.bn_url}>
                        {/* <div className={styles['item']} style={{ backgroundImage: "url('" + DBImageFormat(item.bn_img)[0] + "'), url('" + NoImage + "')" }}/> */}
                        <ErrorCoverImage src={DBImageFormat(item.bn_img)[0]} alt="배너" />
                    </a> :
                    <Link key={item.id} to={item.bn_url.split('ajoonamu.com')[1]}>
                        {/* <div className={styles['item']} style={{ backgroundImage: "url('" + DBImageFormat(item.bn_img)[0] + "'), url('" + NoImage + "')" }}/> */}
                        <ErrorCoverImage src={DBImageFormat(item.bn_img)[0]} alt="배너" />
                    </Link>) : 
                    <Link key={item.id} to={item.bn_url}>
                        {/* <div className={styles['item']} style={{ backgroundImage: "url('" + DBImageFormat(item.bn_img)[0] + "'), url('" + NoImage + "')" }}/> */}
                        <ErrorCoverImage src={DBImageFormat(item.bn_img)[0]} alt="배너" />
                    </Link>)
                ))}
            </Slider>}
        </div>
    );
};

export default HomeSlick;
