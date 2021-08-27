import React from 'react';
import styles from './CheckBox.module.scss';
import classNames from 'classnames/bind';
import Check from 'components/svg/sign/Check';
import { Link } from '@material-ui/core';

const cx = classNames.bind(styles);

export default function CheckBox({ id, text, check, onChange, onClick }) {
    return (
        <div className={cx('check', 'item')}>
            <div className={cx('sub-text')}>
                <input 
                type="checkbox" 
                id={id} 
                checked={check} 
                onChange={onChange} />
                <label className={styles['label']} htmlFor={id}>
                    <Check on={check} />{text}
                </label>
            </div>
            {onClick &&
            <Link onClick={onClick} className={styles['link']} >보기</Link>}
        </div>
    );
};

CheckBox.defaultProps = {
    id: 'check',
    text: 'text',
    check: false,
    onChange: () => console.warn('onChange'),
    url: null,
};