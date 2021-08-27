import axios from 'axios';
import { Paths } from '../../paths';

export const getOtherUserMenu = async () => {
    const req = Paths.api + 'user/item/view_prefer?limit';
    const res = await axios.get(req);
    return res;
};

export const getPreferMenuList = async (
    general_offset = 0,
    general_limit = 100,
    prefer_offset = 0,
    prefer_limit = 100,
    item_type = 1,
    budget,
    desire_quan,
    addr1,
    shop_id,
) => {
    const req = Paths.api + `user/item/prefer`;

    const config = {
        params: {
            general_offset,
            general_limit,
            prefer_offset,
            prefer_limit,
            item_type,
            budget,
            desire_quan,
            addr1,
            shop_id,
        },
        headers:{
            'Content-Type': 'application/json'
        }
    };
    const result = await axios.get(req, config);
    return result.data.query;
};

export const getMainMenuList = async (
    ca_id,
    offset = 0,
    limit = 8,
    shop_id,
) => {
    const req = Paths.api + 'user/item/main';

    const config = {
        params: {
            ca_id,
            limit,
            offset,
            shop_id,
        },
        headers:{
            'Content-Type': 'application/json'
        }
    };
    const result = await axios.get(req, config);
    return result.data.query.items;
};

export const getMenuList = async (ca_id, offset = 0, limit = 8, shop_id) => {
    const req = Paths.api + 'user/item/list';
 

    const config = {
        params: {
            ca_id,
            limit,
            offset,
            shop_id,
        },
        headers:{
            'Content-Type': 'application/json'
        }
    };

    const result = await axios.get(req, config);
    return result;
};

export const getMenuInfo = async (item_id) => {
    const req = Paths.api + `user/item/view?offset&limit&item_id=${item_id}`;
    const config = {
        headers: {
            'content-type': 'application/json',
        },
    };
    const result = await axios.get(req, config);
    return result.data.query;
};

export const getSearchMenu = async (search, offset, limit, shop_id) => {
    const req = Paths.api + 'user/item/search';
    const config = {
        headers: {
            'content-type': 'application/json',
        },
        params: {
            offset,
            limit,
            search,
            shop_id,
        },
    };
    const res = axios.get(req, config);
    return res;
};
