import React, { useCallback } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styles from './SupportContainer.module.scss';

import { Paths } from '../../paths';
import Sidebar from '../../components/sidebar/Sidebar';

import Notice from '../../components/support/Notice';
import FAQ from '../../components/support/FAQ';
import QNA from '../../components/support/QNA';

const LinkList = [
    { name: "공지사항", url: `${Paths.ajoonamu.support}/notice` },
    { name: "자주 묻는 질문", url: `${Paths.ajoonamu.support}/faq` },
    { name: "1:1 문의", url: `${Paths.ajoonamu.support}/qna` },
];

export default ({ pathname }) => {

    const getTitle = useCallback((path) => {
        if (path.indexOf('/qna') !== -1) {
            return "1:1 문의";
        } else if (path.indexOf('/faq') !== -1) {
            return "자주 묻는 질문";
        } else {
            return "공지사항";
        }
    }, []);

    return (
        <div className={styles['container']}>
            <Sidebar title={"고객센터"} linkList={LinkList} active={getTitle(pathname)} />
            <div className={styles['content']}>
                <h2 className={styles['title']}>{getTitle(pathname)}</h2>
                <Switch>
                    <Route path={`${Paths.ajoonamu.support}/notice/:id?`} component={Notice} />
                    <Route path={`${Paths.ajoonamu.support}/qna/:id?`} component={QNA} />
                    <Route path={`${Paths.ajoonamu.support}/faq`} component={FAQ} />
                    <Route render={() => <Redirect to={`${Paths.ajoonamu.support}/notice`} />}/>
                </Switch>
            </div>
        </div>
    );
};
