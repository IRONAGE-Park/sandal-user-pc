import axios from 'axios';
import { Paths } from '../../paths';

export const requestPostEstimate = async (token, {
    estm_email,
    estm_username,
    estm_file
}) => {
    const req = Paths.api + 'user/estimate';
    const formData = new FormData();

    formData.append('estm_email', estm_email);
    formData.append('estm_username', estm_username);
    formData.append('estm_file[]', estm_file);

    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    const res = await axios.post(req, formData,config);
    return res;
};
