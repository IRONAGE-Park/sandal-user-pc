import React, { useCallback, useState } from 'react';
import styles from './Secession.module.scss';
import Select from '../../components/svg/select/Select';
import { ButtonBase } from '@material-ui/core';
import { useStore } from '../../hooks/useStore';
import { useModal } from '../../hooks/useModal';
import { requestPutSecession } from '../../api/auth/auth';
import { useHistory } from 'react-router-dom';
import { Paths } from '../../paths';
import { useDispatch } from 'react-redux';
import { get_address } from '../../store/address/address';
import { noAuthGetNearStore } from '../../api/noAuth/store';
import { get_near_store } from '../../store/address/store';
import { get_menulist } from '../../store/product/product';

const SecessionContainer = () => {
    
    const history = useHistory();
    const dispatch = useDispatch();
    const user_token = useStore();
    const openModal = useModal();

    const [agree, setAgree] = useState(false);
    const onChangeAgree = () => {
        setAgree(!agree);
    };

    const onSecession = useCallback(() => {
        if (agree) {
            openModal('정말로 탈퇴하시겠습니까?', '', async () => {
                try {
                    const res = await requestPutSecession(user_token, agree);
                    if (res.data.msg) {
                        openModal('정상적으로 회원탈퇴 되셨습니다!', '다음에도 저희 샌달을 이용해 주시기 바랍니다.');
                        
                        const noAuth = JSON.parse(localStorage.getItem('noAuthAddrs'));
                        if (noAuth) {
                            const index = noAuth.findIndex((item) => item.active === 1);
                            if (index !== -1) {
                                const { addr1, addr2, lat, lng, post_num } = noAuth[index];
                                dispatch(get_address({ addr1, addr2, lat, lng, post_num }));
                                const near_store = await noAuthGetNearStore(lat, lng, addr1);
                                dispatch(get_near_store(near_store.data.query));
                                dispatch(get_menulist(null));
                            }
                            else{
                                dispatch(get_address({addr1:null,addr2:null,lat:null,lng:null,post_num:null}));
                                dispatch(get_near_store(null));
                                dispatch(get_menulist(null));
                            }
                        }
                        history.push(Paths.ajoonamu.logout);
                    }
                } catch (e) {
                    openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
                }
            }, true);
        } else {
            openModal('확인 요소에 동의하셔야 합니다.', '위 글을 읽고 다시 신청해 주세요.');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_token, agree, openModal, history]);

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <div className={styles['context']}>
                    <div className={styles['title']}>
                        회원 탈퇴를 신청하기전에 먼저 확인해주세요.
                    </div>
                    <div className={styles['text']}>
                        탈퇴 후 회원정보 및 이용기록은 모두 삭제되며 다시 복구가 불가합니다.<br/>
                        주문내역 및 결제 내용은 이용약관과 관련법에 의하여 보관됩니다.<br/>
                        동일한 SNS계정과 이메일을 사용한 재가입은 24시간 이내에 불가합니다.<br/>
                    </div>
                    <div className={styles['box']}>
                        <div className={styles['agree']}>
                            회원탈퇴를 신청 하시겠습니까?
                        </div>
                        <div
                            className={styles['check']}
                            onClick={onChangeAgree}
                        >
                            <Select check={agree} />
                            <span>예, 탈퇴를 신청합니다.</span>
                        </div>
                    </div>
                    <div className={styles['btn']}>
                        <ButtonBase className={styles['update']} onClick={onSecession}>
                            회원 탈퇴하기
                        </ButtonBase>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecessionContainer;
