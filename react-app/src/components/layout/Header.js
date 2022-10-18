import { connect } from "react-redux";
import { setMobileOpenAC } from '../../redux/actions/uiActions'
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Linear from './Linear';
import UpdateStatus from '../header_content/UpdateStatus';

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
    appBar: {
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    link: {
        flexGrow: 1,
        '& > *': {
            textDecoration: 'none',
            color: 'white',
            marginRight: theme.spacing(2),
        }
    },
    update: {
        marginLeft: theme.spacing(2),
    }
}));


const Header = (props) => {
    const classes = useStyles();

    return (
        <AppBar position="absolute" className={classes.appBar}>
            <Linear />
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.handleDrawerToggle}
                    className={classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" noWrap className={classes.link}>
                    <Link to='/' >
                        {'Каталог'}
                    </Link>

                    {props.config.updateStatus && <UpdateStatus text={props.config.textUpdateStatus} className={classes.update} />}

                </Typography>
                {props.displayName && <Avatar alt={props.displayName} src={props.photoURL} component={Link} to={`/profile/${props.uid}`} />}

            </Toolbar>
        </AppBar>)
}

const mapStateToProps = state => {
    return {
        uid: state.UI.uid,
        displayName: state.UI.displayName,
        photoURL: state.UI.photoURL,
        config: state.UI.configuration
    }
}

let mapDispatchToProps = dispatch => {
    return {
        handleDrawerToggle: () => dispatch(setMobileOpenAC())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)