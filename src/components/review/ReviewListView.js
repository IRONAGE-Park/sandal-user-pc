import React from 'react';
import ListView from '../assets/ListView';
import styles from './Review.module.scss';
import ReviewItem from './ReviewItem';

// 슬릭추가
export default ({ reviewList, onClick }) => (
    <div className={styles['container']}>
        <ListView listLength={reviewList.length}>
            {reviewList.map(
                ({
                    email,
                    review_id,
                    review_body,
                    review_images,
                    review_rating,
                }) => (
                    <ReviewItem
                        key={review_id}
                        email={email}
                        body={review_body}
                        images={review_images}
                        rating={review_rating}
                        onClick={() => onClick(review_id)}
                    />
                ),
            )}
        </ListView>
    </div>
);
