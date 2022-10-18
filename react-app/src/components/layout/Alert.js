import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { alertOffAC } from '../../redux/actions/uiActions'


const Alert = (props) => {

    const handleClose = () => {
        props.alertOffAC()
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={props.alertOn}
            autoHideDuration={5000}
            onClose={handleClose}
            message={props.alertMessage}
            action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
        />
    )
}


const mapStateToProps = state => {
    return {
        alertOn: state.UI.alertOn,
        alertMessage: state.UI.alertMessage,
    }
}

export default connect(
    mapStateToProps,
    { alertOffAC }
)(Alert)