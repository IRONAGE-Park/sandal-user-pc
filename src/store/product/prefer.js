import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';

const GET_PREFER_MENU = 'prefer/GET_PREFER_MENU';
const GET_GENERAL_MENU = 'prefer/GET_GENERAL_MENU';
const ADD_PREFER_MENU = 'prefer/ADD_PREFER_MENU';
const ADD_GENERAL_MENU = 'prefer/ADD_GENERAL_MENU';
const SET_TYPE = 'prefer/SET_TYPE'
const SET_SEARCH = 'prefer/SET_SEARCH';
const INIT = 'prefer/INIT';


export const get_prefer_list = createAction(GET_PREFER_MENU);
export const get_general_list = createAction(GET_GENERAL_MENU);
export const add_prefer_list = createAction(ADD_PREFER_MENU);
export const add_gernal_list = createAction(ADD_GENERAL_MENU);
export const set_type = createAction (SET_TYPE);
export const set_serach = createAction (SET_SEARCH);
export const init = createAction(INIT);

const initState = {
    prefer_items: [],
    general_items: [],
    type : 0,
    search: false,
};

const prefer = handleActions(
    {

        [GET_PREFER_MENU]: (state, action) => {
            return{
                ...state,
                prefer_items: action.payload,
            }
        },
        [GET_GENERAL_MENU]: (state, action) => ({
            ...state,
            general_items: action.payload,
        }),
        [SET_TYPE] : (state,action) =>({
            ...state,
            type:action.payload
        }),
        [SET_SEARCH] : (state,action) =>({
            ...state,
            search:action.payload
        }),
        [INIT] : (state, action) =>{
            
            return(
                initState
            )
        }

    },
    initState,
);

export default prefer;
