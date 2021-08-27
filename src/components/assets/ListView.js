import React from 'react';
import Slider from 'react-slick';
import { IconButton } from '@material-ui/core';

import Prev from '../svg/menu/prev.svg';
import Next from '../svg/menu/next.svg';

const arrowStyle = {
    cursor: 'pointer',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '64px',
    height: '64px',
    top: '40%',
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
            right: '-32px',
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
            left: '-32px',
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

// 슬릭추가
export default ({ listLength = 0, maxLength = 4, children, infinite = true, autoplay = true }) => {
    const settings = {
        infinite,
        autoplay,
        speed: 2000,
        slidesToShow: listLength > maxLength ? maxLength : listLength,
        slidesToScroll: maxLength,
        slidePerRow: 1,
        draggable:false,
        variableWidth: !(listLength >= maxLength),
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <Slider {...settings}>
            {children}
        </Slider>
    );
};
