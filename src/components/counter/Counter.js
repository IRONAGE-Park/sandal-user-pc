import React from 'react';
import styles from './Counter.module.scss';

export default function Counter({ value, onIncrement, onDecrement }) {
    return (
        <div className={styles['counter']}>
            <button onClick={onDecrement}>-</button>
            <button>{value}</button>
            <button onClick={onIncrement}>+</button>
        </div>
    );
}
