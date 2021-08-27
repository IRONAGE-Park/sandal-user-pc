import React, { useEffect, useState } from 'react';
import { useModal } from '../../hooks/useModal';
import styles from './Timer.module.scss';

const AuthTimer = ({ start, setStart }) => {
    const [time, setTime] = useState(60 * 3);
    const openModal = useModal();

    useEffect(() => {
        if (start) {
            const Counter = setInterval(() => {
                const temp = time - 1;
                if (temp === -1) {
                    setStart(false);
                    openModal('인증 제한 시간이 초과되었습니다.', '다시 시도해주세요!');
                    clearInterval(Counter);
                } else {
                    setTime(temp);
                }
            }, 1000);
            return () => clearInterval(Counter);
        } else if (!start) {
            setTime(60 * 3);
        }
    }, [start, setStart, time, openModal]);

    const timeFormat = (time) => {
        const m = Math.floor(time / 60).toString();
        let s = (time % 60).toString();
        if (s.length === 1) s = `0${s}`;
        return `${m}:${s}`;
    };

    return <div className={styles['timer']}>{timeFormat(time)}</div>;
};

export default AuthTimer;
