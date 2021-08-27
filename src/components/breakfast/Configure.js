import React from 'react';
import styles from './Configure.module.scss';

export default ({ src, level, content }) => {
    const { name, value, color } = level;
    const { title, one, two, three, four } = content;

    return (
        <div className={styles['configure']} style={{ backgroundImage: 'url(' + src + ')' }} data-aos='fade-up'>
            <div className={styles['content']}>
                <div style={{ backgroundColor: color }} className={styles['level']}>
                    <h3 className={styles['name']}>{name}</h3>
                    <p className={styles['value']}>{value}<span>원~</span></p>
                </div>
                <div className={styles['text']}>
                    <h5 className={styles['title']}>{title}</h5>
                    <div className={styles['area']}>
                        <p>{one}</p>
                        <p>{two}</p>
                    </div>
                    <div className={styles['area']}>
                        <p>{three}</p>
                        <p>{four}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};