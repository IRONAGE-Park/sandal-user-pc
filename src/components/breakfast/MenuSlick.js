import React, { Component } from 'react';
import Slider from 'react-slick';
import VariesMenuItem from './VariesMenuItem';

import item1 from '../svg/breakfast/item1.png';
import item2 from '../svg/breakfast/item2.png';
import item3 from '../svg/breakfast/item3.png';
import item4 from '../svg/breakfast/item4.png';

class MenuSlick extends Component {
    render() {
        const settings = {
            speed: 1000,
            slidesToShow: 4,
            slidesToScroll: 4,
        };
        return (
            <Slider {...settings}>
                <VariesMenuItem src={item1} name={'불고기 샌드위치'} />
                <VariesMenuItem src={item2} name={'클럽 샌드위치'} />
                <VariesMenuItem src={item3} name={'앙버터'} />
                <VariesMenuItem src={item4} name={'과일 도시락'} />
                <VariesMenuItem src={item1} name={'불고기 샌드위치'} />
                <VariesMenuItem src={item2} name={'클럽 샌드위치'} />
                <VariesMenuItem src={item3} name={'앙버터'} />
                <VariesMenuItem src={item4} name={'과일 도시락'} />
            </Slider>
        );
    }
}

export default MenuSlick;
