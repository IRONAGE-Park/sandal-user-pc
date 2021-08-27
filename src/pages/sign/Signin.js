import React, { useEffect } from 'react';
import SignInContainer from 'containers/sign/SignInContainer';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import { Paths } from '../../paths';

function Signin() {
    const history = useHistory();
    const openModal = useModal();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            openModal(
                '잘못된 접근입니다.',
                '로그아웃 하신 후에 이용하실 수 있습니다.',
            );
            history.push(Paths.index);
        }
    }, [openModal, history]);
    return <SignInContainer />;
}

export default Signin;
