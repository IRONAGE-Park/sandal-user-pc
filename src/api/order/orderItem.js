import axios from 'axios';
import { dateToYYYYMMDDHHMMSS } from '../../lib/formatter';
import { Paths } from '../../paths';

export const getOrderList = async (
    token,
    offset = 0,
    limit = 10,
    start_date,
    end_date,
) => {
    const req = Paths.api + 'user/order/list';
    end_date.setHours(23, 59, 59);
    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        params: {
            offset,
            limit,
            end_date: dateToYYYYMMDDHHMMSS(end_date),
            start_date: dateToYYYYMMDDHHMMSS(start_date),
        },
    };
    const res = await axios.get(req, config);
    return res.data.query;
};

export const getDetailOrderView = async (token, order_id) => {
    const req = Paths.api + `user/order/view?order_id=${order_id}`;
    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await axios.get(req, config);
    return res.data.query;
};
