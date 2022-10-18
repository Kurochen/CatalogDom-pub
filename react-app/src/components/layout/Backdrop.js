import { connect } from 'react-redux';
import BackdropNC from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function Backdrop(props) {
    const classes = useStyles();

    return (
        <BackdropNC className={classes.backdrop} open={props.backdrop} >
            <CircularProgress color="inherit" />
        </BackdropNC>

    );
}

const mapStateToProps = state => {
    return {
        backdrop: state.UI.backdrop
    }
}

export default connect(
    mapStateToProps,
    {}
)(Backdrop)