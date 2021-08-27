import { createAction, handleActions } from 'redux-actions';

const OPEN = 'modal/OPEN';
const CLOSE = 'modal/CLOSE';

export const modalOpen = createAction(
    OPEN,
    (confirm, title, text, handleClick) => ({
        confirm,
        title,
        text,
        handleClick,
    }),
);

export const modalClose = createAction(CLOSE, (form) => form);

const initialState = {
    open: false,
    confirm: false,
    title: '창입니다.',
    text: '내용입니다.',
    handleClick: () => {},
};

const modal = handleActions(
    {
        [OPEN]: (state, action) => {
            const { confirm, title, text, handleClick } = action.payload;
            return {
                ...state,
                open: true,
                confirm,
                title,
                text,
                handleClick,
            };
        },
        [CLOSE]: (state, action) => ({
            ...state,
            open: false,
        }),
    },
    initialState,
);

export default modal;
