import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import ko from 'date-fns/locale/ko';
import DatePicker from 'react-datepicker';
import { ButtonBase } from '@material-ui/core';
import styles from './DateRangePicker.module.scss';
import { calculateDate } from '../../lib/calculateDate';

const cn = classnames.bind(styles);

export default ({ startDate, setStartDate, endDate, setEndDate, onClick }) => {

    const [select, setSelect] = useState(0);

    const onDateClick = useCallback((term, type, index) => {
        setSelect(index);
        const setDate = calculateDate(endDate, term, type);
        setStartDate(setDate);
    }, [endDate, setStartDate]);

    const onStartDateChange = useCallback(date => {
        setStartDate(date);
    }, [setStartDate]);
    const onEndDateChange = useCallback(date => {
        setEndDate(date);
    }, [setEndDate]);

    useEffect(() => {
        onDateClick(7, 'DATE', 0);
    }, [onDateClick]);

    return (
        <div className={styles['select-date']}>
            <div className={styles['date']}>
                <ButtonBase className={cn('date-box', { select: select === 0 })} onClick={() => onDateClick(7, 'DATE', 0)}>1주일</ButtonBase>
                <ButtonBase className={cn('date-box', { select: select === 1 })} onClick={() => onDateClick(1, 'MONTH', 1)}>1개월</ButtonBase>
                <ButtonBase className={cn('date-box', { select: select === 2 })} onClick={() => onDateClick(3, 'MONTH', 2)}>3개월</ButtonBase>
                <ButtonBase className={cn('date-box', { select: select === 3 })} onClick={() => onDateClick(6, 'MONTH', 3)}>6개월</ButtonBase>
            </div>
            <div className={styles['date-input-box']}>
                <div className={styles['text']}>기간 입력</div>
                <div className={styles['input']}>
                    <DatePicker
                        locale={ko}
                        dateFormat="yyyy/MM/dd"
                        maxDate={endDate}
                        selected={startDate}
                        onChange={onStartDateChange}
                        // withPortal
                    />
                </div>
                <div className={styles['line']} />
                <div className={styles['input']}>
                    <DatePicker
                        locale={ko}
                        dateFormat="yyyy/MM/dd"
                        minDate={startDate}
                        maxDate={new Date()}
                        selected={endDate}
                        onChange={onEndDateChange}
                        // withPortal
                    />
                </div>
                <ButtonBase className={styles['btn']} onClick={onClick}>
                    조회
                </ButtonBase>
            </div>
        </div>
    );
};
