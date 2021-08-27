import axios from 'axios';
import { Paths } from '../../paths';
export const getCategory = async () => {
    const req = Paths.api + 'user/category/list';
    const config = {
        headers: {
            'content-type': 'application/json',
        },
    };
    const result = await axios.get(req, config);
    return result.data.query.categorys;
};

export const getMainCategory = async () => {
    const req = Paths.api + 'user/category/main';
    const config = {
        headers: {
            'content-type': 'application/json',
        }
    };
    const result = await axios.get(req, config);
    return result.data.query.categorys;
}