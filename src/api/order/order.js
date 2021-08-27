import axios from 'axios';
import { Paths } from '../../paths';

export const user_order = async (
    token,
    order_type,
    order_memo,
    delivery_memo,
    delivery_req_time,
    cp_id,
    point_price = 0,
    settle_case,
    s_name, s_hp,
    r_name, r_hp
) => {
    order_memo = order_memo ? order_memo : "없음";
    delivery_memo = delivery_memo ? delivery_memo : "없음";
    const req = Paths.api + 'user/order';
    let form_data;
    if (cp_id === null) {
        form_data = {
            order_type: 'reserve',
            order_memo: order_memo,
            delivery_memo: delivery_memo,
            delivery_req_time: delivery_req_time,
            point_price: point_price,
            device: 'pc',
            settle_case,
            s_name, s_hp,
            r_name, r_hp
        };
    } else {
        form_data = {
            order_type: 'reserve',
            order_memo: order_memo,
            delivery_memo: delivery_memo,
            delivery_req_time: delivery_req_time,
            cp_id: cp_id,
            point_price: point_price,
            device: 'pc',
            settle_case,
            s_name, s_hp,
            r_name, r_hp
        };
    }

    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    const res = await axios.post(req, form_data, config);
    return res;
};

export const order_cancle = async (token, order_id,settle_case) => {
    const req = Paths.api + 'user/order/cancel';

    const form_data = {
        order_id: order_id,
    };
    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await axios.put(req, form_data,config);
    return res;
};
