import { combineReducers } from 'redux';
import auth, { auth_saga } from './auth/auth';
import { product, breakfast ,prefer} from './product';
import modal from './modal';
import { address, store } from './address';
import company, { company_saga } from './company';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({
    auth,
    product,
    breakfast,
    modal,
    prefer,
    company,
    address,
    store,
});

export function* rootSaga() {
    yield all([auth_saga(), company_saga()]);
}

export default rootReducer;
