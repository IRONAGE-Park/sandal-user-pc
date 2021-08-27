import axios from 'axios';

const URL = "http://www.juso.go.kr/addrlink/addrLinkApi.do";
const KEY= 'devU01TX0FVVEgyMDIwMDgyMzIxNTAzMDExMDA4OTU=';

export const addr_test= async () =>{
    const query = `${URL}`;
    const test = `${URL}?confmKey=${KEY}&currentPage=1&countPerPage=10&keyword=${'동아대학교'}&resultType=json`;
    

    axios.defaults.headers.common['Access-Control-Allow-Origin'] = `*`;

    axios.defaults.url = test;

    const config = {
        params: {
            confmKey:KEY,
            currentPage:1,
            countPerPage:10,
            keyword:'동아대학교',
            resultType:'json'
        },
        headers:{
            
        }
        
    }
    
    const res = await axios.get();
    console.log(res);
    return res.data.results.juso;
}