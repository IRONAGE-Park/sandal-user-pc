import axios from 'axios';
import { Paths } from '../../paths';


export const noAuthGetNearStore = async (lat, lng, addr1) => {
    const req = Paths.api + 'user/shop/near';

    const config = {
        params: {
            lat,
            lng,
            addr1,
        },
        headers:{
            'Content-Type' :'application/json'
        }
    };

    const res = await axios.get(req, config);
    return res;
};