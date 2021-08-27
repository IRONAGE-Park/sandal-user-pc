import axios from 'axios';
import { Paths } from '../../paths';

const URL = 'https://www.juso.go.kr/addrlink/addrLinkApi.do';
const KEY = 'U01TX0FVVEgyMDIwMTIyMjE1NTUyMjExMDU4MDU=';

export const getDeliveryList = async (token) => {
    const req = `${Paths.api}user/delivery/list`;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    const res = await axios.get(req, config);
    return res;
};

export function getCoordinates() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

export const insertAddress = async (
    token,
    post_num,
    addr1,
    addr2,
    extra,
    lat,
    lng,
) => {
    const req = Paths.api + `user/delivery`;

    const form_data = {
        post_num: post_num,
        addr1: addr1,
        addr2: addr2,
        extra: 0,
        lat: lat,
        lng: lng,
    };
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    const res = await axios.post(req, form_data, config);
    return res;
};

export const deleteAddr = async (token, delivery_id) => {
    const req = Paths.api + 'user/delivery/delete';
    const form_data = { delivery_id };
    const res = await axios.delete(req, {
        data: form_data,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return res;
};
export const searchAddress = async (searchAddr) => {
    const req = URL;
    const config = {
        params: {
            confmKey: KEY,
            currentPage: 1,
            countPerPage: 10,
            keyword: searchAddr,
            resultType: 'json',
        },
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    };

    const res = await axios.get(req, config);

    return res.data.results.juso;
};

export const selectAddress = async (token, delivery_id) => {
    const req = Paths.api + 'user/delivery/update';
    const form_data = {
        delivery_id: delivery_id,
    };

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    const res = await axios.put(req, form_data, config);
    return res;
};

export const getActiveAddr = async (token) => {
    const req = `${Paths.api}user/delivery/list`;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    const res = await axios.get(req, config);

    const { query } = res.data;
    let len = Object.keys(query).length;
    for (let i = 0; i < len; i++) {
        if (query[i].active === 1) {
            const { addr1, addr2, lat, lng, post_num } = query[i];
            return { addr1, addr2, lat, lng, post_num };
        }
    }
    return null;
};
