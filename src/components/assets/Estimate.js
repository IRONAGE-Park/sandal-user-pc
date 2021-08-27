import React, { Fragment } from 'react';
import classnames from 'classnames/bind';
import { ButtonBase } from '@material-ui/core';
import styled from 'styled-components';
import { dateToYYYYMMDD, numberFormat } from '../../lib/formatter';
import styles from './Estimate.module.scss';

const cn = classnames.bind(styles);

const EstimateArea = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 320px;
    background-color: #ebebeb;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    &:hover {        
        &::after {
            opacity: 0
        }
    }
    &::after {
        transition: opacity .2s ease-in-out;
        content: '견적서 미리보기';
        display: flex;
        justify-content: center;
        align-items: center;
        left: 0; top: 0;
        position: absolute;
        color: #222;
        font-size: 16px;
        background-color: rgba(0, 0, 0, 0.2);
        width: 100%; height: 100%;
    }
`;
const Estimate = styled.div`
    box-sizing: border-box;
    min-width: 800px;
    max-width: 800px;
    position: absolute;
    text-align: left;
    margin: 0 auto;
    padding: 90px;
    background: #fff;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) scale(0.3);
`;
const Title = styled.h2`
    text-align: center;
    font-size: 36px;
    margin-bottom: 50px;
`;
const Cautions = styled.div`
    text-align: center;
    margin: 50px 0;
    line-height: 1.6;
    font-size: 14px;
`;
const Footer = styled.h3`
    text-align: center;
    font-size: 24px;
    margin: 0;
`;

export default ({
    receiver,
    onDownload, com_name = '샌달', ceo_name,
    address, tel, business_num,
    dlvCost,
    products = [],
}) => {
    let total = 0;
    return (
        <ButtonBase style={{ width: '100%', }} onClick={() => onDownload()}>
            <EstimateArea>
                <Estimate view>
                    <Title>견적서</Title>
                    <table className={styles['table']} id="estimate-table">
                        <thead>
                            <tr>
                                <td rowSpan="2">수신</td>
                                <td className={cn('value')} rowSpan="2">{receiver}</td>
                                <td rowSpan="5">공급자</td>
                                <td>사업자 번호</td>
                                <td className={cn('value')} colSpan="3">{business_num}</td>
                            </tr>
                            <tr>
                                <td>상호</td>
                                <td className={cn('value')}>아주나무 베이커리</td>
                                <td>대표자</td>
                                <td className={cn('value')}>{ceo_name}</td>
                            </tr>
                            <tr>
                                <td rowSpan="2">참조</td>
                                <td className={cn('value')}></td>
                                <td>소재지</td>
                                <td className={cn('value')} colSpan="3">{address}</td>
                            </tr>
                            <tr>
                                <td className={cn('value')}></td>
                                <td>업종</td>
                                <td className={cn('value')}>즉석판매제조가공업</td>
                                <td>업태</td>
                                <td className={cn('value')}>빵류, 제과</td>
                            </tr>
                            <tr>
                                <td>일자</td>
                                <td className={cn('value')}>{dateToYYYYMMDD(new Date())}</td>
                                <td>담당자</td>
                                <td className={cn('value')}>{ceo_name}</td>
                                <td>연락처</td>
                                <td className={cn('value')}>{tel}</td>
                            </tr>
                            <tr><td className={cn('price', 'alert')} colSpan="7">단위(원)</td></tr>
                            <tr>
                                <th>부</th>
                                <th>상품명</th>
                                <th>규격</th>
                                <th>수량</th>
                                <th>단가</th>
                                <th>금액</th>
                                <th>비고</th>
                            </tr>
                        </thead>
                        <tbody className={styles['value']}>
                            {products.map((product, index) => {
                                const {
                                    item,
                                    options,
                                } = product;
                                const components = options.map((option) => {
                                    const {
                                        option_id: itemId,
                                        option_name,
                                        option_price,
                                    } = option;
                                    total += option_price * item.item_quanity;
                                    return (
                                        <tr key={itemId}>
                                            <td></td>
                                            <td></td>
                                            <td className={cn('name')}>{option_name}</td>
                                            <td>{item.item_quanity}</td>
                                            <td className={cn('price')}>{numberFormat(option_price)}</td>
                                            <td className={cn('price')}>{numberFormat(option_price * item.item_quanity)}원</td>
                                            <td></td>
                                        </tr>
                                    );
                                });
                                total += item.item_price * item.item_quanity;
                                return (
                                    <Fragment key={index}>
                                        <tr>
                                            <td></td>
                                            <td className={cn('name')}>{item.item_name}</td>
                                            <td></td>
                                            <td>{item.item_quanity}</td>
                                            <td className={cn('price')}>{numberFormat(item.item_price)}</td>
                                            <td className={cn('price')}>{numberFormat(item.item_price * item.item_quanity)}원</td>
                                            <td></td>
                                        </tr>
                                        {components}
                                    </Fragment>
                                );
                            })}
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className={cn('price')}>합계: {numberFormat(total + parseInt(dlvCost))}원</td>
                                <td className={cn('price')}>배달비: {numberFormat(dlvCost)}원</td>
                            </tr>
                        </tbody>
                    </table>
                    <Cautions>
                        상기와 같이 견적서를 제출합니다.
                    </Cautions>
                    <Footer>{com_name} 드림</Footer>
                </Estimate>
            </EstimateArea>
        </ButtonBase>
    );
};
