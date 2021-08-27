import axios from 'axios';
import { Paths } from '../../paths';


export const kakaoLogin = async()=>{
    const req = Paths.api +'user/kakao';

    const config={
        params:{
            device:"mobile"
        }
    }
  
    const res = await axios.get(req,config);
    return res;
}

export const socialRegister = async(email,name,register_type)=>{
    const req= Paths.api +`user/social_register`;
    const form_data={
         email,name,register_type
    }
    const res = await axios.post(req, form_data);
    return res;
}