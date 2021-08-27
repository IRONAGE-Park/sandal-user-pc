import React, { useCallback, useReducer, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import styles from './Asset.module.scss';
import Dialog from '@material-ui/core/Dialog';
import { ButtonBase } from '@material-ui/core';
import { requestPostEstimate } from '../../api/order/estimate';
import CloseIcon from '../svg/modal/CloseIcon';
import Estimate from '../assets/Estimate';
import Loading from '../assets/Loading';
import { isEmailForm } from '../../lib/formatChecker';
import { useModal } from '../../hooks/useModal';
import SDGothicNEO_R from './AppleSDGothicNeoR';
import SDGothicNEO_B from './AppleSDGothicNeoB';
import { useSelector } from 'react-redux';

const reducer = (state, action) => ({
    ...state,
    [action.name]: action.value,
});

const EstmModal = (props) => {
    const openModal = useModal();

    const { company } = useSelector(state => state.company);
    const { com_name, addr1, addr2, ceo_name, tel, business_num } = company;
    
    const [loading, setLoading] = useState(false);
    const [fullWidth] = React.useState(true);
    const [maxWidth] = React.useState('sm');

    const [state, dispatch] = useReducer(reducer, {
        receiver: '',
        receiver_email: '',
    });
    const [estmFile, setEstmFile] = useState(null);

    const onStateChange = useCallback(e => dispatch(e.target), []);
    const sendEstimate = useCallback(async () => {
        if (estmFile) {
            if (isEmailForm(state.receiver_email)) {
                const token = localStorage.getItem('access_token');
                setLoading(true);
                try {
                    const { receiver, receiver_email } = state;
                    const res = await requestPostEstimate(token, {
                        estm_email: receiver_email,
                        estm_username: receiver,
                        estm_file: estmFile,
                    });
                    if (res.data.msg === "성공") {
                        openModal('성공적으로 전송되었습니다!', '이메일을 확인해 주세요!');    
                        props.order();
                    } else {
                        openModal('전송이 실패했습니다.', '다시 시도해 주세요.');
                    }
                } catch (e) {
                    openModal('예기치 못한 에러가 발생했습니다!', '다시 시도해 주세요.');
                }
                setLoading(false);
            } else {
                openModal('잘못된 이메일 형식입니다.', '이메일 형식을 확인해 주세요.');
            }
        } else {
            openModal('미리보기 시도 후 전송하셔야 합니다.', '견적서를 한 번 확인 후에 시도해주세요.');
        }
    }, [estmFile, state, openModal, props]);

    const onDownload = () => {
        const doc = new jsPDF('p', 'mm');
        doc.addFileToVFS('AppleSDGothicNeoR.ttf', SDGothicNEO_R);
        doc.addFileToVFS('AppleSDGothicNeoB.ttf', SDGothicNEO_B);
        doc.addFont('AppleSDGothicNeoR.ttf', 'apple', 'normal');
        doc.addFont('AppleSDGothicNeoB.ttf', 'apple', 'bold');
        doc.setFont('apple');
        doc.autoTable({
            theme: 'plain',
            styles: {
                font: 'apple',
                fontSize: '30',
                fontStyle: 'bold',
                halign: 'center'
            },
            body: [['견적서']]
        })
        doc.autoTable({
            theme: 'plain',
            styles: {
                font: 'apple',
                fontStyle: 'normal',
                lineWidth: 0.5,
                lineColor: '#222',
                overflow: 'linebreak',
                halign: 'right',
                valign: 'middle'
            },
            headStyles: {
                halign: 'center'
            },
            html: '#estimate-table',
        });
        doc.autoTable({
            theme: 'plain',
            styles: {
                font: 'apple',
                fontStyle: 'normal',
                halign: 'center',
                fontSize: '12',
            },
            footStyles: {
                fontSize: '24',
                fontStyle: 'bold',
            },
            margin: { top: 100 },
            body: [['상기와 같이 견적서를 제출합니다.']],
            foot: [['샌달 드림']]
        })
        
        const blob = doc.output('blob');
        const makeFile = new File([blob], '샌달 견적서.pdf', {
            type: blob.type,
        });
        window.open(doc.output('bloburl'));
        setEstmFile(makeFile);
        setLoading(false);
    };

    return (
        <>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <div className={styles['title-bar']}>
                    <div className={styles['title']}>견적서 발송</div>
                    <div
                        className={styles['close']}
                        onClick={props.handleClose}
                    >
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles['modal-content']}>
                    <div className={styles['modal-input-box']}>
                        <div className={styles['label']}>수신자</div>
                        <input
                            type="text"
                            name="receiver"
                            value={state.receiver}
                            onChange={onStateChange}
                        />
                    </div>
                    <div className={styles['modal-input-box']}>
                        <div className={styles['label']}>받을 이메일 주소</div>
                        <input
                            type="text"
                            name="receiver_email"
                            value={state.receiver_email}
                            onChange={onStateChange}
                        />
                    </div>
                    <div className={styles['estimate']}>
                        <Estimate
                            receiver={state.receiver}
                            com_name={com_name} ceo_name={ceo_name}
                            address={addr1 + ' ' + addr2} business_num={business_num}
                            tel={tel}
                            onDownload={onDownload}
                            products={props.cartList}
                            dlvCost={props.dlvCost}
                        />
                    </div>
                    <div className={styles['box']}>
                        <ButtonBase
                            className={styles['btn']}
                            onClick={props.order}
                        >
                            건너뛰기
                        </ButtonBase>
                        <ButtonBase
                            className={styles['btn'] + ' ' + styles['active']}
                            onClick={sendEstimate}
                        >
                            견적서발송
                        </ButtonBase>
                    </div>
                </div>
            </Dialog>
            <Loading open={loading} />
        </>
    );
};

export default EstmModal;
