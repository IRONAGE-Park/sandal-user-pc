import axios from 'axios';
import { Paths } from '../../paths';

export const requestBannerList = async () => {
    const req = Paths.api + 'user/banner/main';

    const res = await axios.get(req);
    return res;
}