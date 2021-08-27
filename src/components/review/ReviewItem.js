import React from 'react';
import styles from './Review.module.scss';
import { DBImageFormat, hideEmail } from '../../lib/formatter';

import Noimage from '../svg/noimage.png';
import ReviewRating from './ReviewRating';
import ErrorCoverImage from '../assets/ErrorCoverImage';

//홈 메뉴 이미지 컴포넌트
const ReviewImage = ({ src }) => (
    <div className={styles['review-img']}>
        <ErrorCoverImage className={styles['img']} src={src} alt="메뉴 이미지" />
    </div>
);

export default ({ email, body, rating, images, onClick }) => (
    <div className={styles['review-item']} onClick={onClick}>
        <ReviewImage src={images !== "[]" ? DBImageFormat(images)[0] : Noimage} />
        <div className={styles['pd-box']}>
            <div className={styles['text']}>
                <p className={styles['body']}>{body}</p>
                <div className={styles['info']}>
                    <p className={styles['user']}><span>{hideEmail(email)}</span>님</p>
                    <ReviewRating rating={rating} textAlign="right" />
                </div>
            </div>
        </div>
    </div>
);
