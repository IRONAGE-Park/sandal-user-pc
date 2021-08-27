import React, { useCallback } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styles from './AgreeContainer.module.scss';
import { Paths } from '../../paths';
import Sidebar from '../../components/sidebar/Sidebar';
import TermOfUse from '../../components/agree/TermOfUse';
import Policy from '../../components/agree/Policy';
import ScrollTop from '../../components/scrollTop/ScrollToTop';
import { useSelector } from 'react-redux';

const LinkList = [
    { name: "개인정보처리방침", url: Paths.ajoonamu.policy },
    { name: "이용약관", url: Paths.ajoonamu.term_use },
];


export default ({ pathname }) => {
    
    const getTitle = useCallback((path) => {
        if (path.indexOf('/term_use') !== -1) {
            return "이용약관";
        } else {
            return "개인정보처리방침";
        }
    }, []);

    const { company } = useSelector(state => state.company);

    return (
        <ScrollTop>
            {company && <div className={styles['container']}>
                <Sidebar title={"약관 및 정책"} linkList={LinkList} active={getTitle(pathname)} />
                <div className={styles['content']}>
                    <h2 className={styles['title']}>{getTitle(pathname)}</h2>
                    <Switch>
                        <Route path={Paths.ajoonamu.policy} render={() => <Policy content={company.private_policy_user} />} />
                        <Route path={Paths.ajoonamu.term_use} render={() => <TermOfUse content={company.use_terms_user} />} />
                        <Route render={() => <Redirect to={`${Paths.ajoonamu.policy}`} />}/>
                    </Switch>
                </div>
            </div>}
        </ScrollTop>
    );
};
