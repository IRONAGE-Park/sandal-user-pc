import { useReducer } from 'react';

const reducer = (state, action) => ({
    ...state,
    [action.name]: action.value,
});

export default function useInputs(initState) {
    const [state, dispatch] = useReducer(reducer, initState);
    const onChange = (e) => {
        dispatch(e.target);
    };
    return [state, onChange];
}
