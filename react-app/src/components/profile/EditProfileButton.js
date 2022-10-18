import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    buttons: {
        //float: 'right',
        //marginTop: theme.spacing(2),
    }
}));


const EditProfileButton = (props) => {
    const classes = useStyles();
    let text = 'Редактировать'
    if (props.profileFirstTime === true) {
        text = "Добавить анкету"
    }
    return (
        <Button
            className={classes.buttons}
            variant="outlined"
            color="primary"
            component={Link}
            to={'/profile/edit'}
        >
            {text}
        </Button>
    )
}

const mapStateToProps = state => {
    return {
        profileFirstTime: state.UI.profileFirstTime
    }
}

export default connect(
    mapStateToProps,
    // { setUserProfileDB, getUserProfileDB }
)(EditProfileButton)