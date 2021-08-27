import React from 'react';
import styles from './VariesMenuItem.module.scss';

export default ({ src, name }) => (
    <div className={styles['varies']}>
        <img className={styles['image']} src={src} alt="다양한 메뉴" />
        <p className={styles['name']}>{name}</p>
    </div>
);
