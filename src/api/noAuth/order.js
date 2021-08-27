import axios from 'axios';
import { Paths } from '../../paths';

export const noAuth_order = async (
    cart_ids,
    s_name,
    s_hp,
    post_num,
    addr1,
    addr2,
    lat,
    lng,
    order_type = 'reserve',
    order_memo,
    delivery_memo,
    delivery_req_time,
    settle_case,
    r_name, r_hp
) => {
    order_memo = order_memo ? order_memo : "없음";
    delivery_memo = delivery_memo ? delivery_memo : "없음";
    const req = Paths.api + 'noauth/order';

    const form_data = {
        cart_ids,
        s_name,
        s_hp,
        post_num,
        addr1,
        addr2,
        lat,
        lng,
        order_type,
        order_memo,
        delivery_memo,
        delivery_req_time,
        device: 'pc',
        settle_case,
        r_name, r_hp
    };
    const config = {
        headers: {
            'content-type': 'application/json',
     
        },
    };
    const res = await axios.post(req, form_data,config);
    return res;
};

export const noAuthOrderView = async (order_id) => {
    const req = Paths.api + `noauth/order/view?order_id=${order_id}`;
    const res = await axios.get(req);
    return res.data.query;
};
export const noAutuOrderCancle = async (order_id, s_hp,settle_case) => {
    const req = Paths.api + 'noauth/order/cancel';

    const form_data = {
        order_id: order_id,
        s_hp: s_hp,
    };

    const config = {
        headers: {
            'content-type': 'application/json',
        },
    };

    const res = await axios.put(req, form_data,config);
    return res;
};
