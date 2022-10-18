import { makeStyles } from '@material-ui/core/styles';
import {
    Switch,
    Route
} from "react-router-dom";
import routes from "./routes"



const useStyles = makeStyles((theme) => ({
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(2),
    },
}));

const ContetntMain = () => {
    const classes = useStyles();
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
                {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        children={<route.main />}
                    />
                ))}
            </Switch>
        </main>
    )
}

export default ContetntMain;
