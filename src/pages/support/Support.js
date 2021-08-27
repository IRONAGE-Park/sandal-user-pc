import React from 'react';
import SupportContainer from '../../containers/support/SupportContainer';

const Support = ({ location }) => {

    const { pathname } = location;
    const selector = pathname.replace('/support', '');
    return (
        <SupportContainer pathname={selector !== '' ? selector : '/notice'} />
    );
};

export default Support;
