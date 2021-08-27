import React,{useCallback} from 'react';
import styles from './Mypage.module.scss';
import { Paths } from '../../paths';
import Sidebar from '../../components/sidebar/Sidebar';
import { Redirect, Route, Switch } from 'react-router-dom';

import CouponConatainer from '../coupon/CouponContainer';
import AccountContainer from '../account/AccountContainer';
import OrderListContainer from '../order/OrderListContainer';
import OrderReviewContainer from '../order/OrderReviewContainer';
import OrderDetailContainer from '../order/OrderDetailContainer';
import SecessionContainer from '../secession/SecessionContainer';

const LinkList = [
    { name: "주문내역", url: `${Paths.ajoonamu.mypage}/order_list` },
    { name: "쿠폰함", url: `${Paths.ajoonamu.mypage}/coupon` },
    { name: "내 정보 관리", url: `${Paths.ajoonamu.mypage}/account` },
    { name: "회원탈퇴", url: `${Paths.ajoonamu.mypage}/secession` },
];
const MypageContainer = ({ pathname }) => {

    const getTitle = useCallback((path) => {
        if (path.indexOf('/order_list') !== -1) {
            return '주문내역';
        } else if (path.indexOf('/order_detail') !== -1) {
            return '주문내역';
        } else if (path.indexOf('/order_review') !== -1) {
            return '주문내역';
        } else if (path.indexOf('/coupon') !== -1) {
            return '쿠폰함';
        } else if (path.indexOf('/secession') !== -1) {
            return '회원탈퇴';
        } else {
            return '내 정보 관리';
        }
    }, []);

    return (
        <div className={styles['container']}>
            <Sidebar title={"나의정보"} linkList={LinkList} active={getTitle(pathname)} />
            <div className={styles['content']}>
                <h2 className={styles['title']}>{getTitle(pathname)}</h2>
                <Switch>
                    <Route path={`${Paths.ajoonamu.mypage}/order_list/:id?`} component={OrderListContainer} />
                    <Route path={`${Paths.ajoonamu.mypage}/order_detail`} component={OrderDetailContainer} />
                    <Route path={`${Paths.ajoonamu.mypage}/order_review`} component={OrderReviewContainer} />
                    <Route path={`${Paths.ajoonamu.mypage}/coupon/:id?`} component={CouponConatainer} />
                    <Route path={`${Paths.ajoonamu.mypage}/account`} component={AccountContainer} />
                    <Route path={`${Paths.ajoonamu.mypage}/review`} render={() => alert('준비중입니다.')} />
                    <Route path={`${Paths.ajoonamu.mypage}/secession`} component={SecessionContainer} />
                    <Route render={() => <Redirect to={`${Paths.ajoonamu.mypage}/order_list`}/>} />
                </Switch>
            </div>
        </div>
    );
};

export default MypageContainer;