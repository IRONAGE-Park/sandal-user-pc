import React from 'react';
import OrderItem from './OrderItem';

const OrderItemList = ({ items, info, center }) => {
    const list = items.map((item, index) => (
        <OrderItem {...item} key={index} info={info[index]} qty={info[index].qty} center={center} />
    ));
    return <>{list}</>;
};

export default OrderItemList;
