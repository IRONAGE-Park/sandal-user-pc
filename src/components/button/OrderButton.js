import React from 'react';
import styles from './OrderButton.module.scss';


const OrderButton = ({ title, onClick }) => {
    /*
        메인화면 뷰 예약주문 , 배달주문 리스트
    */
    return (
        <div className={styles['order-btn']} onClick={onClick}>
            {title}
        </div>
    )
}

export default OrderButton; 