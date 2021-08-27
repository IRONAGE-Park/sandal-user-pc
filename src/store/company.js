import { createAction, handleActions } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';
import { getCompanyInfo } from '../api/company/company';

const GET_COMPANY_INFO = 'company/GET_COMPANY_INFO';
const GET_COMPANY_INFO_SUCCESS = 'company/GET_COMPANY_INFO_SUCCESS';
const GET_COMPANY_INFO_FAILURE = 'company/GET_COMPANY_INFO_FAILURE';

export const get_company_info = createAction(GET_COMPANY_INFO);

function* get_company_info_saga(action) {
    try {
        const res = yield call(getCompanyInfo);
        if(res.data.msg === 'success' ) {
            yield put({
                type: GET_COMPANY_INFO_SUCCESS,
                payload: res.data.query.company
            });
        } else {
            yield put({
                type: GET_COMPANY_INFO_FAILURE,
                payload: false
            });
        }
    } catch (e) {
        yield put({
            type: GET_COMPANY_INFO_FAILURE,
            payload: e
        });
    }
}

export function* company_saga() {
    yield takeEvery(GET_COMPANY_INFO, get_company_info_saga);
}

const company = handleActions(
    {
        [GET_COMPANY_INFO]: (state, action) => ({
            ...state,
            loading: true
        }),
        [GET_COMPANY_INFO_SUCCESS]: (state, action) => ({
            ...state,
            company: action.payload,
            loading: false
        }),
        [GET_COMPANY_INFO_FAILURE]: (state, action) => ({
            ...state,
            error: action.payload,
            loading: false
        })
    },
    {
        loading: false,
        company: null,
        error: null
    }
);

export default company;