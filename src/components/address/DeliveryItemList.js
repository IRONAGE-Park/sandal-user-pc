import React from 'react';
import styles from './Addr.module.scss';
import DeliveryrItem from './DeliveryrItem';

const DeliveryItemList = (props) => {
    /*
        최근주소 컴포넌트를 렌더할 리스트
    */

    let list = [];
    if (props.user_token) {
        list = props.addrs.map((addr) => (
            <DeliveryrItem
                {...addr}
                key={addr.delivery_id}
                id={addr.delivery_id}
                onClick={() => props.onClick(addr.delivery_id, addr.addr1 ,addr.addr2 ,addr.lat,addr.lng ,addr.post_num)}
                onRemove={() => props.onRemove(addr.delivery_id)}
            />
        ));
    } else {
        list = props.addrs.map((addr, index) => (
            <DeliveryrItem
                {...addr}
                key={index}
                id={index}
                onClick={() => props.onClick(index, addr.addr1, addr.addr2, addr.lat, addr.lng , addr.post_num)}
                onRemove={() => props.onRemove(index)}
            />
        ));
    }


    return <div className={styles['delivery-list']}>{list}</div>;
};

export default DeliveryItemList;
