import axios from 'axios';
import { dateToYYYYMMDDHHMMSS } from '../../lib/formatter';
import { Paths } from '../../paths';

export const getMyCoupons = async (token) => {
    const req = Paths.api + 'user/coupon/list_my';
    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const result = await axios.get(req, config);
    return result.data.query;
};
export const getOrderCoupons = async (token) => {
    const req = Paths.api + 'user/coupon/list_order';
    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const result = await axios.get(req, config);
    return result.data.query;
};
export const getDownloadCpList = async (token) => {
    const req = Paths.api + 'user/coupon/list_zone';
    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const result = await axios.get(req, config);
    return result.data.query;
};
export const getUseCpList = async (token, start_date, end_date) => {
    const req = Paths.api + 'user/coupon/list_use';

    end_date.setHours(23, 59, 59);
    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        params: {
            start_date: dateToYYYYMMDDHHMMSS(start_date),
            end_date: dateToYYYYMMDDHHMMSS(end_date)
        }
    };
    const result = await axios.get(req, config);
    return result.data.query;
};

export const downloadCoupon = async (token, cz_id) => {
    const req = Paths.api + 'user/coupon';

    const form_data = {
        cz_id: cz_id,
    };
    const config={
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }

    const res = await axios.post(req, form_data,config);
    return res;
};

export const couponInput = async (token, cp_id) => {
    const req = Paths.api + 'user/coupon/input';
    const form_data = {
        cp_id: cp_id,
    };
    const config={
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }


    const res = await axios.put(req, form_data,config);
    return res;
};
