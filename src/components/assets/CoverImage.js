import React from 'react';
import NoImage from '../svg/noimage.png';

export default ({ className, src, vertical_rate = "100%" }) => {

    return (
        <div style={{
            backgroundImage: 'url(' + src + '), url(' + NoImage + ')',
            paddingTop: vertical_rate,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%'
        }}
            className={className}
        />
    );
};
