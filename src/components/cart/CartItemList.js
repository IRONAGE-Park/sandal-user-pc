import React from 'react';
import CartItem from './CartItem';

const CartItemList = (props) => {
    const list = props.carts.map((cart, index) => (
        <CartItem
            id={index}
            key={index}
            {...cart}
            checked={cart.checked}
            handleCheckChild={props.handleCheckChild}
            handleIncrement={props.handleIncrement}
            handleDecrement={props.handleDecrement}
            handleDelete={props.handleDelete}
            handleOpen={props.handleOpen}
        />
    ));
    return <div>{list}</div>;
};

export default React.memo(CartItemList);
