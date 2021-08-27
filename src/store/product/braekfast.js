import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';

const GET_CATEGORY = 'brakefast/GET_CATEGORY';
const GET_MENULIST = 'brakefast/GET_MENULIST';
const ADD_MENUITEM = 'brakefast/ADD_MENUITEM';

export const get_break_catergory = createAction(GET_CATEGORY);
export const get_breakMenuList = createAction(GET_MENULIST);
export const add_breakMenuitem = createAction(ADD_MENUITEM);

const initState = {
    categorys: [],
    items: null,
};

const breakfast = handleActions(
    {
        [GET_CATEGORY]: (state, action) => ({
            ...state,
            categorys: state.categorys.concat(action.payload),
        }),
        [GET_MENULIST]: (state, action) => ({
            ...state,
            items: action.payload,
        }),
        [ADD_MENUITEM]: (state, action) => {
            const { items } = state;
            const ca_id = action.payload.ca_id;
            const index = items.findIndex((item) => item.ca_id === ca_id);

            //하나의 카테고리에 같은 메뉴가 있으면 안되니 그걸로 중복 판단.
            const item_id = action.payload.items[0].item_id;
            const isPush = items[index].items.findIndex(
                (item) => item.item_id === item_id,
            );
            if (isPush === -1) {
                const newState = produce(items, (draft) => {
                    draft[index].items = draft[index].items.concat(
                        action.payload.items,
                    );
                });
                return {
                    ...state,
                    items: newState,
                };
            } else {
                return state;
            }
        },
    },
    initState,
);

export default breakfast;
