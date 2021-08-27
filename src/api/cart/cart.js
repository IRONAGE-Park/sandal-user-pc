import axios from 'axios';
import { Paths } from '../../paths';

export const getCartList = async (token) => {
    const req = Paths.api + 'user/cart/list';
    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await axios.get(req, config);
    return res;
}

export const addCartItem = async (
    token,
    item_id,
    item_options,
    item_quanity,
) => {
    const req = Paths.api + 'user/cart';
    const form_data = {
        item_id: item_id,
        item_option_id: item_options,
        item_quanity: item_quanity,
    };
    const config ={
        headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' :'application/json',
        }
    }
    const res = await axios.post(req, form_data,config);
    return res;
};

export const deleteCartItem = async (token, cart_id) => {
    const req = Paths.api + 'user/cart/delete';
    const form_data = { cart_id };

    const res = await axios.delete(req, {
        data: form_data,
        headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' :'application/json',
        }
    });
    return res;
}

export const updateCartQunaity = async(token ,cart_id,item_quanity)=>{
    
    const req = Paths.api + 'user/cart/quanity';
    const form_data = {
        cart_id,
        item_quanity,
    };

    const config ={
        headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' :'application/json',
        }
    }
    const res = await axios.put(req, form_data,config);
    return res;
}