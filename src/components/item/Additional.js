import React from 'react';
import styles from './Additional.module.scss';
import Select from '../svg/select/Select';
import { numberFormat } from '../../lib/formatter';

//추가선택 아이템
const Additional = (props) => {
    return (
        <div className={styles['additional-item']}>
            <input type="checkbox" id="test"></input>
            <label
                onClick={props.onClickAddItem}
                className={styles['label']}
                htmlFor="test"
            >
                <Select check={props.check} />
                {props.option_name} <span>(+ {numberFormat(props.option_price)}원)</span>
            </label>
        </div>
    );
};

export default Additional;
