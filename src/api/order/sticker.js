import axios from 'axios';
import { Paths } from '../../paths';

export const requestPostPhraseSerive = async (token, {
    order_id,
    sticker_logo,
    sticker_text
}) => {
    const req = Paths.api + 'user/sticker';

    const formData = new FormData();
    formData.append('order_id', order_id);
    sticker_logo.forEach(logo => formData.append('sticker_logo[]', logo, logo.name));
    formData.append('sticker_text', sticker_text);
    
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await axios.post(req, formData,config);
    return res;
};
