import React from 'react';
/* Library */

import { useSelector } from 'react-redux';
/* Redux */

import Modal from '../../components/assets/Modal';
/* Components */

export default () => {
    const state = useSelector(state => state.modal);
    const { title, text, handleClick, open, confirm } = state;
    return <Modal confirm={confirm} title={title} text={text} handleClick={handleClick} open={open} />;
};
