import axios from 'axios';
import { Paths } from '../../paths';

export const requestEventList = async (offset, limit) => {
    const req = Paths.api + 'user/event/list';
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

export const requestEventShow = async (event_id) => {
    const req = Paths.api + 'user/event/show';
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        params: { event_id }
    };

    const result = await axios.get(req, config);
    return result.data.query;
};