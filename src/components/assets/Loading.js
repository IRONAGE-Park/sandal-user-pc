import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 9999,
        color: '#fff',
        // color: '#007246'
    },
}));

export default ({ open }) => {
    const classes = useStyles();
    return (
        <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};
