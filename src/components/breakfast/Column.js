import React from 'react';
import classnames from 'classnames/bind';
import styles from './Column.module.scss';

const cn = classnames.bind(styles);

export default ({ header, type, fee, location, cost }) => (
    <div className={cn('column', { header } )} data-aos='fade-up'>
        <div style={{ width: 100 }} className={styles['row']}>{type}</div>
        <div style={{ width: 100 }} className={styles['row']}>{fee}</div>
        <div style={{ width: 200 }} className={styles['row']}>{location}<b>{cost}</b></div>
    </div>
)