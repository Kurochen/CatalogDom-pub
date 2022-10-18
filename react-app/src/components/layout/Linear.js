import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        zIndex: theme.zIndex.drawer + 1,
        width: '100%',
        position: 'absolute',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

function Linear(props) {
    const classes = useStyles();

    if (props.linear === true) {
        return (
            <div className={classes.root}>
                <LinearProgress />
            </div>
        )
    } else {
        return <></>
    }
}

const mapStateToProps = state => {
    return {
        linear: state.UI.linear
    }
}

export default connect(
    mapStateToProps,
    {}
)(Linear)
