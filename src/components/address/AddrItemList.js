import React from 'react';
import styles from './Addr.module.scss';
import AddrItem from './AddrItem';

const AddrItemList = ({ addrs, onClick }) => {
    /*
        검색 결과 주소 컴포넌트를 렌더할 리스트
    */

    const addrsList = addrs.map((addr, index) => (
        <AddrItem
            key={index}
            index={index}
            jibunAddr={addr.jibunAddr}
            roadAddr={addr.roadAddr}
            post_num={addr.zipNo}
            active={addr.active}
            onClick={() => onClick(addr.jibunAddr, addr.zipNo, index)}
        />
    ));
    return <div className={styles['addr-list']}>{addrsList}</div>;
};

export default AddrItemList;
