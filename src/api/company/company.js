import axios from 'axios';
import { Paths } from '../../paths';

export const getCompanyInfo = async (token) => {
    const req = Paths.api + 'user/company/main';
    const config = {
        headers: {
            'content-type': 'application/json',
        },
    };
    const res = await axios.get(req,config);
    return res;
};
