import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { Fade } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    fade: {
        float: 'right',
        color: 'gray',
        fontSize: 21
    },
}));

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

const HelpsButton = (props) => {
    const classes = useStyles();


    const initialState = {
        isHovered: false
    }
    const [state, setState] = useState(initialState)

    const toggleHover = () => {
        if (props.title) {
            setState({ ...state, isHovered: !state.isHovered })
        }
    }
    return (
        <div onMouseEnter={toggleHover} onMouseLeave={toggleHover} >
            <HtmlTooltip title={props.title} >
                <Fade in={state.isHovered} className={classes.fade} timeout={{ enter: 2000, exit: 0 }}>
                    <HelpOutlineIcon />
                </Fade>
            </HtmlTooltip>
            {props.children}
        </div>
    )
}

export default HelpsButton