import { useState, useEffect, useMemo } from 'react';

export const useScroll = (loading) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);
    const [innerHeight, setInnerHeight] = useState(0);
    const [prevScroll, setPrevScroll] = useState(0);
    const isScrollEnd = useMemo(
        () => scrollHeight !== 0 && scrollHeight - innerHeight - scrollTop < 1,
        [scrollHeight, innerHeight, scrollTop],
    );
    const onScroll = () => {
        setInnerHeight(window.innerHeight);
        setScrollHeight(document.body.scrollHeight);
        setPrevScroll(scrollTop);
        const top =
            window.scrollY ||
            (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop;
        if (!loading) {
            setScrollTop(top);
            sessionStorage.setItem('scrollTop', top);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', onScroll, false);

        return () => {
            window.removeEventListener('scroll', onScroll, false);
        };
    });

    return {
        scrollTop,
        scrollHeight,
        innerHeight,
        prevScroll,
        isScrollEnd,
    };
};
