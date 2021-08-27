import { createAction, handleActions } from 'redux-actions';

const GET_NEAR_STORE = 'store/GET_NEAR_STORE';

export const get_near_store = createAction(GET_NEAR_STORE);

const initState = {
    store: null,
};

const store = handleActions(
    {
        [GET_NEAR_STORE]: (state, action) => ({
            ...state,
            store: action.payload,
        }),
    },
    initState,
);

export default store;
