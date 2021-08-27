import React from 'react';
import styles from './Agree.module.scss';

export default ({ content }) => (
    <div className={styles['table']}>
        <div className={styles['wrap']} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
);