import React from 'react';
import SidebarContent from './SidebarContent';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import { connect } from 'react-redux';
import { setMobileOpenAC } from '../../redux/actions/uiActions'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: drawerWidth,
    },

}));


const Sidebar = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const { window } = props;
    const container = window !== undefined ? () => window().document.body : undefined;

    return (

        <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden mdUp implementation="css">
                <Drawer
                    container={container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={props.mobileOpen}
                    onClose={props.setMobileOpenAC}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <SidebarContent />
                </Drawer>
            </Hidden>
            <Hidden smDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    <SidebarContent />
                </Drawer>
            </Hidden>
        </nav>
    )
}

const mapStateToProps = state => {
    return {
        mobileOpen: state.UI.mobileOpen
    }
}

export default connect(
    mapStateToProps,
    { setMobileOpenAC }
)(Sidebar)