import React from 'react';
import ReserveContainer from '../../containers/shop/ReserveContainer';
import qs from 'qs';
function Reserve({ location }) {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    let menu = query.menu;
    if (menu === undefined) {
        menu = '1';
    }
    return <ReserveContainer tab={parseInt(menu)} />;
}
export default Reserve;
