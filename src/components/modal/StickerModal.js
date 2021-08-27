import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import styles from './StickerModal.module.scss';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '../svg/modal/CloseIcon';
import DefaultLogo from '../svg/modal/Logo.svg'
import PhraseTemplateList from '../assets/PhraseTemplateList';
import { requestPostPhraseSerive } from '../../api/order/sticker';

import { ButtonBase } from '@material-ui/core';
import { useModal } from '../../hooks/useModal';

const cn = classnames.bind(styles);

const InputLogo = ({ handleChange }) => {
    const [file, setFile] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            handleChange(e.target.files);
            setFile(e.target.files[0].name); // 파일 상태 업데이트
        }
    };
    return (
        <div className={styles['input-area']}>
            <ButtonBase component="div" className={cn('input-logo', 'input-box')}>
                <input
                    id="import-logo"
                    className={styles['filebox']}
                    type="file"
                    accept="image/gif, image/jpeg, image/png, image/svg"
                    onChange={handleImageChange}
                />
                <label
                    className={styles['filelabel']}
                    htmlFor="import-logo"
                >
                    <div className={styles['text']}>이미지 찾아보기</div>
                </label>
            </ButtonBase>
            <p className={styles['filename']}>{file}</p>
        </div>
    );
};
const InputPhrase = ({ handleChange }) => {
    return (
        <div className={styles['input-area']}>
            <textarea
                className={cn('input-phrase', 'input-box')}
                onChange={e => handleChange(e.target.value)}
            />
        </div>
    );
};
const InputPreview = ({ template, logo, phrase }) => {
    const [preview, setPreview] = useState(null);
    const state = {};
    switch (template) {
        case 0:
            state.image = 'top'; state.text = 'bottom';
            break;
        case 1:
            state.image = 'bottom'; state.text = 'top'; 
            break;
        case 2:
            state.image = 'left'; state.text = 'right'; 
            break;
        default:
            state.image = 'right'; state.text = 'left'; 
            break;
    }
    
    useEffect(() => {
        if (logo) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // 2. 읽기가 완료되면 아래코드가 실행됩니다.
                const base64 = reader.result;
                if (base64) {
                    setPreview(base64.toString()); // 파일 base64 상태 업데이트
                }
            }
            reader.readAsDataURL(logo[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
        }
    }, [logo])
    return (
        <div className={styles['preview']}>
            <ButtonBase disabled className={cn('input-preview', 'input-box')}>
                <div className={cn('circle', 'preview_out')}>
                    <div className={cn('circle', 'preview_in')}>
                        <div className={cn('box', 'image', state.image)}>
                            <img className={styles['logo']} src={preview ? preview : DefaultLogo} alt="미리보기 로고" />
                            <p className={styles['name']}>샌달 드림</p>
                        </div>
                        <div className={cn('box', 'text', state.text)}>
                            <p className={styles['phrase']}>{phrase}</p>
                        </div>
                    </div>
                </div>
            </ButtonBase>
        </div>
    );
};
const GuideTemplate = ({ title, children, className }) => (
    <div className={cn('guide', className)}>
        <h3 className={styles['label']}>{title}</h3>
        <div className={styles['content']}>{children}</div>
    </div>
);

const StickerModal = ({ open, handleClose, order_number, token }) => {
    const [template, setTemplate] = useState(0);
    const [logo, setLogo] = useState(null);
    const [phrase, setPhrase] = useState('');
    const openModal = useModal();

    const TemplateList = [
        {
            class: 'template',
            title: '템플릿을 선택해주세요.',
            content: (
                <PhraseTemplateList
                    template={template}
                    handleChange={setTemplate}
                />
            ),
        },
        {
            class: 'logo',
            title: '로고 이미지를 선택해주세요.',
            content: <InputLogo handleChange={setLogo} />,
        },
        {
            class: 'phrase',
            title: '입력하실 문구를 입력하세요.',
            content: <InputPhrase phrase={phrase} handleChange={setPhrase} />,
        },
        {
            class: 'preview',
            title: '미리보기',
            content: (
                <InputPreview template={template} logo={logo} phrase={phrase} />
            ),
        },
    ];

    const sendSticker = useCallback(async () => {
        if (!logo) {
            openModal('로고 이미지가 없습니다!', '로고 이미지를 첨부해 주셔야 합니다.');
        } else if (phrase === '') {
            openModal('입력하실 문구가 없습니다!', '서비스 받을 문구를 입력해 주셔야 합니다.');
        } else {
            try {
                const res = await requestPostPhraseSerive(token, {
                    order_id: order_number,
                    sticker_logo: logo,
                    sticker_text: phrase
                });
                if (res.data.msg === '성공') {
                    openModal('문구서비스가 신청되었습니다!', '고객님이 원하시는 문구를 작성해 드리겠습니다.');
                    handleClose();
                } else if (res.data.msg === '이미 해당 주문번호에 대한 스티커가 존재') {
                    openModal('문구 스티커는 한 번만 신청할 수 있습니다.');
                } else {
                    openModal('예기치 못한 에러가 발생했습니다!', '다시 시도해 주세요.');
                }
            } catch (e) {
                openModal('잘못된 접근입니다.', '잠시 후 다시 시도해 주세요.');
            }
        }
    }, [logo, phrase, order_number, token, openModal, handleClose]);

    useEffect(() => {
        if (open) {
            // 껏다 켜지면 초기화
            setTemplate(0);
            setLogo(null);
            setPhrase('');
        }
    }, [open])

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            className={styles['dialog']}
        >
            <div className={styles['title-bar']}>
                <div className={styles['title']}>문구 서비스 신청</div>
                <div className={styles['close']}>
                    <CloseIcon onClick={handleClose}/>
                </div>
            </div>
            <div className={styles['modal-content']}>
                <div className={styles['container']}>
                    {TemplateList.map((template, index) => (
                        <GuideTemplate
                            key={index}
                            title={template.title}
                            className={template.class}
                        >
                            {template.content}
                        </GuideTemplate>
                    ))}
                </div>
                <div className={styles['confirm']}>
                    <ButtonBase
                        className={styles['btn']}
                        onClick={sendSticker}
                    >
                        신청하기
                    </ButtonBase>
                </div>
            </div>
        </Dialog>
    );
};

export default StickerModal;
