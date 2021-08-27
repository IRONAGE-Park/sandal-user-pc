import React, { useCallback, useState } from 'react';
import styles from './PreferModal.module.scss';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '../svg/modal/CloseIcon';
import { ButtonBase, IconButton } from '@material-ui/core';
import { numberFormat, stringNumberToInt } from '../../lib/formatter';
import { onlyNumber } from '../../lib/formatChecker';

const ReserveModal = (props) => {
    const { desireQuan, setDesireQuan } = props;
    const setMinus = useCallback(() => setDesireQuan(desireQuan - 1), [desireQuan]);
    const setPlus = useCallback(() => setDesireQuan(desireQuan + 1), [desireQuan]);
    return (
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="form-dialog-title"
            className={styles['dialog']}
        >
            <div className={styles['title-bar']}>
                <div className={styles['title']}> 맞춤 주문 설정 </div>
                <div className={styles['close']} onClick={props.handleClose}>
                    <CloseIcon />
                </div>
            </div>
            <div className={styles['modal-content']}>
                <div className={styles['label']}>전체예산</div>
                <div className={styles['modal-input-box']}>
                    <input
                        className={styles['value-input']}
                        onKeyDown={e => e.key === 'Enter' ? props.onClickCustomOrder() : !onlyNumber(e.key) && e.preventDefault()}
                        value={numberFormat(props.budget)}
                        onChange={props.onChangeBudget}
                    />
                    <span>원</span>
                    {/* <input
                        className={styles['value-input']}
                        onKeyDown={e => !onlyNumber(e.key) && e.preventDefault()}
                        value={numberFormat(props.endBudget)}
                        onChange={props.onChangeEndBudget}
                    />
                    <span>원 까지</span> */}
                </div>

                <div className={styles['box']}>
                    <div className={styles['label']}>희망 수량</div>
                    <div className={styles['counter']}>
                        <div className={styles['count-box']}>
                            <IconButton
                                onClick={setMinus}
                                className={styles['decrement']}
                            >
                                -
                            </IconButton>
                            <input type="text" className={styles['value']} value={numberFormat(desireQuan)} onChange={e => setDesireQuan(stringNumberToInt(e.target.value)) } />
                            <IconButton
                                onClick={setPlus}
                                className={styles['increment']}
                            >
                                +
                            </IconButton>
                        </div>
                    </div>
                </div>
                <ButtonBase
                    className={styles['btn']}
                    onClick={props.onClickCustomOrder}
                >
                    설정
                </ButtonBase>
            </div>
        </Dialog>
    );
};

export default ReserveModal;
