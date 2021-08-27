import React, { useCallback, useEffect, useRef } from 'react';
import classnames from 'classnames/bind';
import { makeStyles } from '@material-ui/core/styles';
/* Library */

import { useDispatch } from 'react-redux';
import { modalClose } from '../../store/modal';
/* Redux */

import { Backdrop, ButtonBase } from '@material-ui/core';
/* Components */

import styles from './Modal.module.scss';
/* StyleSheets */

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 2500
    },
}));

const cn = classnames.bind(styles);

export default ({ confirm, title, text, handleClick = () => {}, open }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const confirmButton = useRef(null);

    const onClose = useCallback(() => dispatch(modalClose()), [dispatch]);
    const onClick = useCallback(() => {
        handleClick();
        onClose();
    }, [handleClick, onClose]);

    const onKeyDown = useCallback(e => {
        if (open) {
            if (e.key === 'Enter') {
                onClick();
            } else if (e.key === 'Escape') {
                onClose();
            }
            e.stopPropagation();
        }
    }, [onClick, onClose, open]);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown, true);
        return () => document.removeEventListener('keydown', onKeyDown, true);
    }, [onKeyDown]);

    return (
        <>
            <div className={cn('modal', { confirm,  open })}>
                <div className={styles['area']}>
                    <div className={cn('content')}>
                        <h3 className={styles['title']}>
                            {title.split('\n').map((line, index) => <span key={index}>{line} <br /></span>)}
                        </h3>
                        {text && <p className={styles['text']}>{text.split('\n').map((line, index) => <span key={index}>{line} <br /></span>)}</p>}
                    </div>
                    <div className={styles['bottom']}>
                        {confirm &&
                            <ButtonBase className={cn('button')} onClick={onClose}>
                                아니오
                            </ButtonBase>
                        }
                        <ButtonBase ref={confirmButton} className={cn('button', 'active')} onClick={onClick}>
                            {confirm ? "예" : "확인"}
                        </ButtonBase>
                    </div>
                </div>
            </div>
            <Backdrop
                className={classes.backdrop}
                open={open}
                onClick={onClose}
            />
        </>
    );
};
