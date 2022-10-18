import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Link2 from '@material-ui/core/Link';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary">
            {'Copyright © Каталог домов '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({

    footer: {
        padding: theme.spacing(2, 2),
        marginTop: theme.spacing(3),
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    },
    link: {
        display: "block"
    }
}));

const Footer = (props) => {
    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            < >
                <Link2
                    className={classes.link}
                    variant="string"
                    color="textSecondary"
                    component={Link}
                    to={`/help/howaddhouse`} >
                    {"Как добавить проект"}
                </Link2>
                <Link2
                    className={classes.link}
                    variant="string"
                    color="textSecondary"
                    component={Link}
                    to={`/help/howbuyhouse`} >
                    {"Как купить проект"}
                </Link2>
                {props.config.contact && <Link2
                    className={classes.link}
                    target="_blank"
                    rel="noopener"
                    variant="string"
                    color="textSecondary"
                    href={props.config.contact} >
                    {"Контакты"}
                </Link2>}
                <Copyright />
            </>
        </footer>
    );
}

const mapStateToProps = state => {
    return {
        config: state.UI.configuration
    }
}

export default connect(
    mapStateToProps,
)(Footer)