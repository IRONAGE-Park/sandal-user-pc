import axios from 'axios';
import { Paths } from '../../paths';

export const requestQNAList = async (token, offset, limit) => {
    const req = Paths.api + 'user/qna/list';
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        params: {
            offset, limit
        }
    };
    const result = await axios.get(req, config);
    return result.data.query;
};

export const requestQNADetail = async (token, id) => {
    const req = Paths.api + 'user/qna/view';
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        params: { id }
    };
    const res = await axios.get(req, config);
    return res;
}

export const requestQNADelete = async (token, id) => {
    const req = Paths.api + 'user/qna/delete';


    const res = await axios.delete(req, { data: { id },
        headers:{
        'Context-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    } });
    return res;
}

export const requestQNAUpdate = async (token, {
    id,
    title: subject,
    content: question,
    files: q_files
}) => {
    const req = Paths.api + 'user/qna/update';
    const formData = new FormData();
    
    formData.append('id', id);
    formData.append('subject', subject);
    formData.append('question', question);
    q_files.forEach(image => formData.append('q_files[]', image, image.name));
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

export const requestQNAStore = async (token, {
    title: subject,
    content: question,
    files: q_files
}) => {
    const req = Paths.api + 'user/qna';
    
    const formData = new FormData();
    
    formData.append('subject', subject);
    formData.append('question', question);
    q_files.forEach(image => formData.append('q_files[]', image, image.name));
    
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    };

    const res = await axios.post(req, formData,config);
    return res;
};
