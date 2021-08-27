import React from 'react';
import OrderListContainer from 'containers/order/OrderListContainer';

export default function OrderList({ match }) {
    return (<OrderListContainer tab={match.params.tab} />);
}
