import React from 'react';
import Additional from './Additional';

//추가선택 아이템 리스트
const AdditionalList = ({ itemList, onClickAddItem }) => {
    const list = itemList.map((item) => (
        <Additional
            key={item.option_id}
            option_id={item.option_id}
            option_name={item.option_name}
            option_price={item.option_price}
            check={item.check}
            onClickAddItem={(e) => onClickAddItem(item.option_id)}
        />
    ));
    return (<div>{list}</div>);
};

export default AdditionalList;
