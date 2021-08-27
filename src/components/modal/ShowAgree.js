import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import styles from './ShowAgree.module.scss';
import CloseIcon from '../svg/modal/CloseIcon';
import { useSelector } from 'react-redux';

export default ({ open, title, handleClose }) => {
    const { company } = useSelector(state => state.company);

    return (
        <Dialog
            className={styles['dialog']}
            open={open}
            scroll={'paper'}
            onClose={handleClose}
        >
            <DialogTitle className={styles['title']}>
                {title}
                <div className={styles['close']} onClick={handleClose}>
                    <CloseIcon />
                </div>
            </DialogTitle>

            <DialogContent>
                <DialogContentText
                    id="scroll-dialog-description"
                    tabIndex={-1}
                >
                    {company && <div className={styles['content']} dangerouslySetInnerHTML={{ __html: title !== '개인정보처리방침' ? company.private_policy_user : company.use_terms_user }} />}
                </DialogContentText>
            </DialogContent>
            <DialogActions className={styles['button-area']}>
                <Button onClick={handleClose} className={styles['button']}>
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
};
