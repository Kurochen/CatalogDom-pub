
import routes from "./routes"
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import LoginArea from '../LoginArea';
import {
    Switch,
    Route,
} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    sidebar: {
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    flexGrow_1: {
        flexGrow: 1
    }
}));

const SidebarContent = () => {
    const classes = useStyles();
    return (
        <div className={classes.sidebar}>
            <div className={classes.toolbar} />
            <Divider />

            <Switch>
                {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        children={<route.sidebar />}
                    />
                ))}
            </Switch>

            <div className={classes.flexGrow_1} />
            <LoginArea />
        </div>

    )
}

export default SidebarContent



