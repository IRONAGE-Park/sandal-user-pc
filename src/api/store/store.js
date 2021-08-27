import axios from 'axios';
import { Paths } from '../../paths';

//지점 검색
export const getStoreList = async (search, offset, limit) => {
    const req = Paths.api + 'user/shop/list';

    const config = {
        params: {
            search,
            limit,
            offset
        },
        headers:{
            'Content-Type' :'application/json'
        }
    }

    const res = await axios.get(req, config);
    return res;
};


export const getNearStore = async (token,lat,lng,addr1)=>{
    const req = Paths.api + 'user/delivery/select';

    const config = {
        params: {
            lat,
            lng,
            addr1
        },
        headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' :'application/json',
        }
    }

    const res = await axios.get(req, config);
    return res;
}