import axios from 'axios';
import { Paths } from '../../paths';

export const requestGetReviewList = async (offset, limit) => {
    const req = Paths.api + 'user/review/list';

    const config = {
        params: {
            offset, limit
        },
        headers:{
            'Content-Type' : 'application/json'
        }
    };
    const res = await axios.get(req, config);
    return res;
};

export const requestGetReviewMyList = async (token, offset, limit) => {
    const req = Paths.api + 'user/review/mypage_list';
    const config = {
        params: {
            offset, limit
        },
        headers:{
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
        }
    };

    const res = await axios.get(req, config);
    return res;
};

export const requestGetReviewView = async (review_id) => {
    const req = Paths.api + 'user/review/view';

    const config = {
        params: {
            review_id
        },
        headers:{
            'content-type': 'application/json',
        }
    };

    const res = await axios.get(req, config);
    return res;
}

export const requestPostReviewStore = async (token, {
    order_id, review_body, review_rating, 
    review_images
}) => {
    const req = Paths.api + 'user/review';
    const formData = new FormData();
    formData.append('order_id', order_id);
    formData.append('review_body', review_body);
    formData.append('review_rating', review_rating);
    review_images.forEach(image => formData.append('review_images[]', image, image.name));
    
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    };

    const res = await axios.post(req, formData,config);
    return res;
}

export const requestPostReviewUpdate = async (token, {
    review_id, review_body, review_rating, 
    review_images
}) => {
    const req = Paths.api + 'user/review/update';
    
    const formData = new FormData();
    formData.append('review_id', review_id);
    formData.append('review_body', review_body);
    formData.append('review_rating', review_rating);
    review_images.forEach(image => formData.append('review_images[]', image, image.name));
    formData.append('_method', 'put');
    
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    };

    const res = await axios.post(req, formData,config);
    return res;
}