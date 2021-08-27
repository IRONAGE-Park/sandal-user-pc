import axios from 'axios';
import {Paths} from '../../paths';



export const getBreakCategory = async()=>{
    const req = Paths.api +`user/item/breakfast_cate`;
    const res = await axios.get(req);
    return res;
}

export const getBreakMenu =async(ca_id,offset=0,limit=100)=>{
    const req= Paths.api + `user/item/breakfast`;
    const config = {
        params: {
            ca_id,
            limit,
            offset,
        },
        headers:{
          'Content-Type' : 'application/json',
        }
    }
    const res = await axios.get(req, config);
    return res;

}