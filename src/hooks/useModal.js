import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { modalOpen } from "../store/modal";


export const useModal = () => {
    const modalDispatch = useDispatch();
    const openAlert = useCallback((title, text, handleClick = () => {}, confirm = false) => {
        modalDispatch(modalOpen(confirm, title, text, handleClick));
    }, [modalDispatch]);
    
    return openAlert;
}