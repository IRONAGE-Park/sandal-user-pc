import React from 'react';
import { ButtonBase } from '@material-ui/core';
import classnames from 'classnames/bind';

import styles from './DetailPaging.module.scss';
import { useHistory } from 'react-router-dom';

const cn = classnames.bind(styles);

const newURL = (type, baseURL, newId) => {
    switch (type) {
        case 'QUERY':
            return baseURL + '?id=' + newId;
        default:
            return baseURL + '/' + newId;
    }
}

export default ({ baseURL, idList, currentId, type, listViewURL }) => {
    const history = useHistory();
    const findIdIndex = idList.findIndex(id => id === currentId);
    return (
        <div className={styles['paging']}>
            <div className={styles['move']}>
                <ButtonBase className={cn('button', { disabled: findIdIndex === 0 })}
                    disabled={findIdIndex === 0}
                    onClick={() => history.push(newURL(type, baseURL, idList[findIdIndex - 1]))}>
                    이전
                </ButtonBase>
                <ButtonBase className={cn('button', { disabled: findIdIndex === idList.length - 1 })}
                    disabled={findIdIndex === idList.length - 1}
                    onClick={() => history.push(newURL(type, baseURL, idList[findIdIndex + 1]))}>
                    다음
                </ButtonBase>
            </div>
            <div className={styles['back']}>
                <ButtonBase className={cn('button', 'black')} onClick={() => history.push(listViewURL ? listViewURL : baseURL)}>
                    목록
                </ButtonBase>
            </div>
        </div>
    )
}