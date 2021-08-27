import React from 'react';

import { IconButton } from '@material-ui/core';

import TemplateOne from '../svg/phrase/TemplateOne';
import TemplateTwo from '../svg/phrase/TemplateTwo';
import TemplateThree from '../svg/phrase/TemplateThree';
import TemplateFour from '../svg/phrase/TemplateFour';

import styles from './PhraseTemplate.module.scss';

const TemplateImages = [TemplateOne, TemplateTwo, TemplateThree, TemplateFour];

const PhraseTemplateItem = ({ children, onClick }) => (
    <IconButton className={styles['item']} onClick={onClick}>
        {children}
    </IconButton>
);

export default ({ template, handleChange }) => {
    return (
        <div className={styles['list']}>
            {TemplateImages.map((Image, index) => (
                <PhraseTemplateItem
                    key={index}
                    onClick={() => handleChange(index)}
                >
                    <Image selected={template === index} />
                </PhraseTemplateItem>
            ))}
        </div>
    );
};
