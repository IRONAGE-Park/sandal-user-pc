export const calculateDate = (date, term, type) => {
    const cal_date = new Date(date);
    switch (type) {
        case 'DATE':
            return new Date(cal_date.setDate(cal_date.getDate() - term));
        case 'MONTH':
            return new Date(cal_date.setMonth(cal_date.getMonth() - term));
        case 'YEAR' :
            return new Date(cal_date.setFullYear(cal_date.getFullYear() - term));
        default:
            return cal_date;
    }
}
export const calculateDay = (date) => {
    date = date.replace(/-/gi, '/'); // '2019/09/09 17:22'
    var newArr = date.split(' ');
    const week = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)'];

    const cal_date = new Date(date);
    const day = week[cal_date.getDay()];
    const str = newArr.join(` ${day} `);

    return str;
};
export const calculateDaySection =(start,end) =>{
    let req_time = new Date(start);
    let today = new Date(end);

    const s_year = req_time.getFullYear();
    const s_month = req_time.getMonth()+1;
    const s_date = req_time.getDate();

    const e_year = today.getFullYear();
    const e_month = today.getMonth()+1;
    const e_date = today.getDate();
    req_time= new Date(s_year,s_month,s_date);
    today = new Date(e_year,e_month,e_date);
    // req_time= new Date('2021','01','08');
    // today = new Date('2021','01','07');
    const elapsedMSec = today.getTime() - req_time.getTime(); // 172800000
    const elapsedDay = elapsedMSec / 1000 / 60 / 60 / 24; // 2
 
    return !(elapsedDay>=-1);
}