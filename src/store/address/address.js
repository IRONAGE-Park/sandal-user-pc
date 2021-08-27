import { createAction, handleActions } from 'redux-actions';

const GET_ADDRESS = 'address/GET_ADDRESS';
// const GET_ADDR2 = 'address/GET_ADDR2';

export const get_address = createAction(GET_ADDRESS);

const initState = {
    addr1: null,
    addr2: null,
    lat: null,
    lng: null,
    post_num: null,
};

const product = handleActions(
    {
        [GET_ADDRESS]: (state, action) => ({
            addr1: action.payload.addr1,
            addr2: action.payload.addr2,
            lat: action.payload.lat,
            lng: action.payload.lng,
            post_num: action.payload.post_num,
        }),
    },
    initState,
);

export default product;
