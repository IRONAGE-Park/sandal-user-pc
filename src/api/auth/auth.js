import axios from 'axios';
import { Paths } from '../../paths';

export const getUserInfo = async (token) => {
    const req = Paths.api + 'user/me';

    const config={
        headers:{
            'Authorization' :`Bearer ${token}`,
            'Content-Type' : 'application/json',
        }
    }

    const res = await axios.post(req,null,config);
    return res.data;
};

export const requestAgreeChange = async (token, type, value) => {
    const req = Paths.api + 'user/mypage/agree_' + type;
    const form_data = {
        ['agree_' + type]: value,
    };

    const config={
        headers:{
            'Authorization' :`Bearer ${token}`,
            'Content-Type' : 'application/json',
        }
    }
    const res = await axios.put(req, form_data,config);
    return res;
};

export const updateName = async (token, value) => {
    const req = Paths.api + 'user/mypage/update_name';
    const form_data = {
        name: value,
    };

    const config={
        headers:{
            'Authorization' :`Bearer ${token}`,
            'Content-Type' : 'application/json',
        }
    }

    const res = await axios.put(req, form_data,config);
    return res;
};

export const updatePhone = async (token, value) => {
    const req = Paths.api + 'user/mypage/update_hp';
    const form_data = {
        hp: value,
    };
    const config={
        headers:{
            'Authorization' :`Bearer ${token}`,
            'Content-Type' : 'application/json',
        }
    }

    const res = await axios.put(req, form_data,config);
    return res;
};

export const updatePassword = async (token, pw_o, pw, pw_c) => {
    const req = Paths.api + 'user/mypage/update_pw';
    const form_data = {
        pw_o,
        pw,
        pw_c
    };
    const config={
        headers:{
            'Authorization' :`Bearer ${token}`,
            'Content-Type' : 'application/json',
        }
    }

    const res = await axios.put(req, form_data,config);
    return res;
};

export const localLogin = async (email, password) => {
    const req = Paths.api + 'user/login';
    const form_data = {
        email: email,
        password: password,
    };
    const config={
        headers:{
            'Content-Type' : 'application/json',
        }
    }
    const res = await axios.post(req, form_data,config);
    return res;
};

export const localLogout = async (token) => {
    const req = Paths.api + 'user/logout';

    const config={
        headers:{
            'Authorization' :`Bearer ${token}`,
            'Content-Type' : 'application/json',
        }
    }
    const res = await axios.post(req,null,config);
    return res.data;
};

export const localRegister = async (
    email,
    password,
    password_confirm,
    agree_marketing,
) => {
    const req = Paths.api + 'user/register';
    const form_data = {
        email,
        password,
        password_confirm,
        agree_marketing,
    };

    const config={
        headers:{
            'Content-Type' : 'application/json',
        }
    }

    const res = await axios.post(req, form_data,config);
    return res;
};

export const findId = async (name, hp) => {
    const req = Paths.api + 'user/find_id';
 
    const form_data = {
        name,
        hp,
    };

    const config={
        headers:{
            'Content-Type' : 'application/json',
        }
    }
    const res = await axios.post(req, form_data,config);
    return res;
};
export const findPw = async (name, hp, email) => {
    const req = Paths.api + 'user/find_pw';

    const form_data = {
        name,
        hp,
        email,
    };
    const config={
        headers:{
            'Content-Type' : 'application/json',
        }
    }
    const res = await axios.post(req, form_data,config);
    return res;
};
export const changePw = async (email, name, hp, pw, pw_c) => {
    const req = Paths.api + 'user/change_pw';

    const form_data = {
        email, name, hp, pw, pw_c
    };
    const config={
        headers:{
            'Content-Type' : 'application/json',
        }
    }
    const res = await axios.post(req, form_data,config);
    return res;
}

export const requestPostMobileAuth = async (pv_hp) => {
    const req = Paths.api + 'mobile/auth';

    const form_data = {
        pv_hp,
    };
    const config={
        headers:{
            'Content-Type' : 'application/json',
        }
    }
    const res = await axios.post(req, form_data,config);
    return res;
};
export const requestPostMobileAuthCheck = async (pv_hp, pv_vnum) => {
    const req = Paths.api + 'mobile/confirm';

    const form_data = {
        pv_hp,
        pv_vnum,
    };
    const config={
        headers:{
            'Content-Type' : 'application/json',
        }
    }
    const res = await axios.post(req, form_data,config);
    return res;
};

export const requestPutSecession = async (token, agree_secession) => {
    const req = Paths.api + 'user/mypage/update_status';

    const config={
        headers:{
            'Authorization' :`Bearer ${token}`,
            'Content-Type' : 'application/json',
        }
    }
    const res = await axios.put(req, { agree_secession },config);
    return res;
}