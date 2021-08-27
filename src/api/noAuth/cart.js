import axios from 'axios';
import { Paths } from '../../paths';

export const noAuthAddCart = async (
    item_id,
    item_options,
    item_quanity,
    lat,
    lng
) => {
    const req = Paths.api + 'noauth/cart';
    const form_data = {
        item_id: item_id,
        item_option_id: item_options,
        item_quanity: item_quanity,
        lat:lat,
        lng:lng
    };
    axios.defaults.headers.post['Context-Type'] = 'application/json';

    const res = await axios.post(req, form_data);
    return res;
};

export const noAuthGetCartList = async (cart_id, lat, lng, addr1) => {
    const req = Paths.api + `noauth/cart/list`;

    const res = await axios.get(req, {
        params: {
            'cart_ids[]': cart_id,
            lat: lat,
            lng: lng,
            addr1: addr1,
        },
    });

    return res;
};

export const noAuthRemoveCartItem = async (cart_id) => {
    const req = Paths.api + `noauth/cart/delete`;

    const form_data = { cart_id };

    const res = await axios.delete(req, {
        data: form_data,
        headers:{
            'Content-Type':'application/json',
        }
    });
    return res;
};

export const noAuthUpdateCartQunaity = async (cart_id, item_quanity) => {
    const req = Paths.api + 'noauth/cart/quanity';
    const form_data = {
        cart_id,
        item_quanity,
    };

    const config ={
        headers:{
            'Content-Type' :'application/json',
        }
    }
    const res = await axios.put(req, form_data,config);
    return res;
};