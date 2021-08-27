import axios from 'axios';
import { Paths } from '../../paths';

export const requestNoticeList = async (offset, limit) => {
    const req = Paths.api + 'user/notice/list';
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            offset, limit
        }
    };
    const result = await axios.get(req, config);
    return result.data.query;
};

export const requestNoticeItem = async (id) => {
    const req = Paths.api + 'user/notice/show';
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            id
        }
    };

    const result = await axios.get(req, config);
    return result.data.query;
}