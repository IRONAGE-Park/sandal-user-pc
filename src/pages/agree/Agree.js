import React from 'react';
import AgreeContainer from '../../containers/agree/AgreeContainer';

const Agree = ({ location }) => {
    return (<AgreeContainer pathname={location.pathname} />);
};

export default Agree;
