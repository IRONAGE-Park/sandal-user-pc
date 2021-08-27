import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Addr.module.scss';
import Dialog from '@material-ui/core/Dialog';
import AddrItemList from 'components/address/AddrItemList';
import CloseIcon from '../svg/modal/CloseIcon';
import { searchIcon } from 'components/svg/header';
import { ButtonBase, IconButton } from '@material-ui/core';

const AddressModal = (props) => {
    const [fullWidth] = useState(true);
    const [maxWidth] = useState('sm');

    const searchInputRef = useRef(null);
    const detailInputRef = useRef(null);

    const { open, addrs, searchAddr, detailAddr, selectAddr } = props;
    const {
        handleClose,
        onChangeSearchAddr,
        onClickSearch,
        onChangeDetail,
        onClickAddrItem,
        onClickDeliveryAddrInsert,
        onKeyPressDeliveryAddr
    } = props;

    const onAddressItemClick = useCallback((jibunAddr, zipNo, index) => {
        onClickAddrItem(jibunAddr, zipNo, index);
        if (detailInputRef.current) {
            detailInputRef.current.focus();
        } 
    }, [onClickAddrItem]);

    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            className={styles['dialog']}
        >
            <div className={styles['title-bar']}>
                <div className={styles['title']}>배달 받을 주소</div>
                <div className={styles['close']}>
                    <CloseIcon onClick={handleClose}/>
                </div>
            </div>
            <div className={styles['modal-content']}>
                <div className={styles['modal-input']}>
                    <input
                        className={styles['input']}
                        type="text"
                        value={searchAddr}
                        placeholder="예) 샌달동 12-3 또는 샌달 아파트"
                        onChange={onChangeSearchAddr}
                        onKeyPress={props.handleKeyPress}
                        ref={searchInputRef}
                    />
                    <IconButton
                        className={styles['icon']}
                        onClick={onClickSearch}
                    >
                        <img src={searchIcon} alt="search"/>
                    </IconButton>
                </div>
                <div className={styles['search-result']}>
                    {addrs && `${addrs.length}개의 검색결과가 있습니다.`}
                </div>
                <div className={styles['addrs-box']}>
                    <div className={styles['addrs-list']}>
                        {addrs ? (
                            <AddrItemList
                                addrs={addrs}
                                onClick={onAddressItemClick}
                            />
                        ) : ('')}
                    </div>
                </div>
                <div className={styles['detail-addr']}>
                    <div className={styles['addr']}>
                        {selectAddr ? selectAddr : ''}
                    </div>
                    <div className={styles['detail-input']}>
                        <input
                            className={styles['modal-input']}
                            type="text"
                            value={detailAddr}
                            placeholder="상세 주소를 입력하세요."
                            onChange={onChangeDetail}
                            onKeyPress={onKeyPressDeliveryAddr}
                            ref={detailInputRef}
                        />
                    </div>
                    <div className={styles['btn-box']}>
                        <ButtonBase className={styles['btn']} onClick={onClickDeliveryAddrInsert}>
                            이 주소로 배달지 설정
                        </ButtonBase>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default AddressModal;
