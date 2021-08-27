import React, { useCallback, useEffect, useState } from 'react';
import styles from './Review.module.scss';
import ProfileImg from '../svg/sign/profile.png';
import Slider from 'react-slick';
import { Backdrop, ButtonBase, Dialog, IconButton } from '@material-ui/core';
import Prev from '../svg/review/prev.svg';
import Next from '../svg/review/next.svg';
import CloseIcon from '../svg/modal/CloseIcon';
import cn from 'classnames/bind';
import { requestGetReviewView } from '../../api/review/review';
import Loading from '../assets/Loading';
import ReviewRating from '../review/ReviewRating';
import { dateToYYYYMMDD, DBImageFormat, hideEmail } from '../../lib/formatter';
import { useModal } from '../../hooks/useModal';
import TAG from '../svg/review/tag.svg';
import { useHistory } from 'react-router-dom';
import { Paths } from '../../paths';
import ErrorCoverImage from '../assets/ErrorCoverImage';

const cx = cn.bind(styles);

const arrowStyle = {
    cursor: 'pointer',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '64px', height: '64px',
    padding: '0',
    top: '40%',
    borderRadius: '50%',
    zIndex: 1000,
};

const ReviewModal = (props) => {
    const history = useHistory();
    const openModal = useModal();

    const [userEmail ,setUserEmail] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [rate, setRate] = useState(5.0);
    const [craetedAt, setCreatedAt] = useState(new Date());
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const getReviewContent = useCallback(async () => {
        if (props.id !== -1) {
            setLoading(true);
            try {
                const res = await requestGetReviewView(props.id);
                if (res.data.msg === '성공') {
                    const { email, review_body, review_rating, review_images, created_at } = res.data.query.review;
                    setUserEmail(email);
                    setContent(review_body);
                    setRate(parseFloat(review_rating));
                    setCreatedAt(created_at);
                    setFiles(DBImageFormat(review_images));
                    setTags(res.data.query.items);
                } else {
                    openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
                }
            } catch (e) {
                openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
            }
            setLoading(false);
        }
    }, [openModal, props.id]);

    useEffect(() => {
        getReviewContent();
    }, [getReviewContent]);


    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            maxWidth={"xl"}
            aria-labelledby="form-dialog-title"
        >
            { loading ? <Loading open={loading} />
            : <div className={cx('dialog')}>
                <ReviewImgList images={files} />
                <div className={styles['content']}>
                    <div className={styles['close']}>
                        <CloseIcon onClick={props.handleClose} black={true} />
                    </div>
                    <div className={styles['user-info']}>
                        <UserProfile src={ProfileImg} />
                        <UserEmail mail={userEmail} />
                    </div>
                    <div className={styles['review-info']}>
                        <div className={styles['review-box']}>
                            <div className={styles['review']}>
                                {content}
                                <div className={styles['info']}>
                                    <ReviewRating rating={rate} />
                                    <p className={styles['created-at']}>
                                        {dateToYYYYMMDD(craetedAt, '/')}에 작성된 글입니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['tags']}>
                        {tags.map(({ item_name, item_id }) => {
                            return (
                                <ButtonBase key={item_id} className={styles['tag']} onClick={() => history.push(Paths.ajoonamu.product + '?item_id=' + item_id)}>
                                    <span>{item_name}</span>
                                    <img src={TAG} alt="바로가기" />
                                </ButtonBase>
                            );
                        })}
                    </div>
                </div>
                <Backdrop open={props.open} onClick={props.handleClose} />
            </div>}
        </Dialog>
    );
};

const UserProfile = ({ src }) => (
    <div className={styles['user-profile']}>
        <img src={src} alt="profile" />
    </div>
);

const UserEmail = ({ mail }) => (
    <div className={styles['user-email']}>
        <span className={styles['email']}>{hideEmail(mail)}</span>
        <span>님</span>
    </div>
);

const MenuImg = ({ src }) => (
    <ErrorCoverImage className={styles['img']} src={src} alt="메뉴" />
);

const PrevArrow = ({ style, onClick }) => (
    <IconButton
        style={{
            ...style,
            ...arrowStyle,
            left: '0',
        }}
        onClick={onClick}
    >
        <img style={{ }} src={Prev} alt="prev" />
    </IconButton>
);

const NextArrow = ({ style, onClick }) => (
    <IconButton
        style={{
            ...style,
            ...arrowStyle,
            right: '0',
        }}
        onClick={onClick}
    >
        <img style={{ }} src={Next} alt="next" />
    </IconButton>
);

const ReviewImgList = ({ images }) => {
    const settings = {
        infinite: true,
        autoplay: false,
        dots: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div className={styles['slick-img']}>
            <Slider {...settings}>
                {images.map(image => (<MenuImg key={image} src={image} />))}
            </Slider>
        </div>
    );
};

export default ReviewModal;
