import React from 'react';
import BreakfastContainer from '../../containers/breakfast/BreakfastContainer';
import BreakfastMenuContainer from '../../containers/breakfast/BreakfastMenuContainer';
import qs from 'qs';

const Breakfast = ({ match ,location}) => {
    const { name } = match.params;
    const check = name !== 'menu' && name !== 'configure';

    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });

    let tab = query.tab;
    if (tab === undefined) {
        tab = '0';
    }
    return <>{check ? <BreakfastContainer /> : <BreakfastMenuContainer tab={parseInt(tab)} />}</>;
};

export default Breakfast;
