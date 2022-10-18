import React from 'react';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { logOutCA, setMobileOpenFalseAC } from '../redux/actions/uiActions'
import { connect } from 'react-redux';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    link: {
        textDecoration: 'none',

    },

}));


const LoginArea = (props) => {
    if (props.isLoggedIn) {
        return <LogOut logOutCA={props.logOutCA} />
    }
    return <LogIn setMobileOpenFalseAC={props.setMobileOpenFalseAC} />

}

const LogIn = (props) => {
    const classes = useStyles();
    return (
        <ListItem button component={Link} to={'/login'} onClick={props.setMobileOpenFalseAC}>
            <ListItemIcon>            </ListItemIcon>
            <ListItemText primary="Вход" />
        </ListItem>

    )
}

const LogOut = (props) => {
    return (
        <ListItem button onClick={props.logOutCA}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Выход" />
        </ListItem>
    )
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.UI.login
    }
}

export default connect(
    mapStateToProps,
    {
        logOutCA,
        setMobileOpenFalseAC
    }
)(LoginArea)



// import React from 'react';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import { makeStyles } from '@material-ui/core/styles';
// import { logOutCA, setMobileOpenFalseAC } from '../redux/actions/uiActions'
// import { connect } from 'react-redux';

// import {
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     Link
// } from "react-router-dom";

// const useStyles = makeStyles((theme) => ({
//     link: {
//         textDecoration: 'none',

//     },

// }));


// const LoginArea = (props) => {
//     if (props.isLoggedIn) {
//         return <LogOut logOutCA={props.logOutCA} setMobileOpenFalseAC={props.setMobileOpenFalseAC} />
//     }
//     return <LogIn setMobileOpenFalseAC={props.setMobileOpenFalseAC} />

// }

// const LogIn = (props) => {
//     return (
//         <ListItem button
//             component={Link}
//             to={'/login'}
//             onClick={props.setMobileOpenFalseAC}
//         >
//             <ListItemIcon><ExitToAppIcon /></ListItemIcon>
//             <ListItemText primary="Вход" />
//         </ListItem>

//     )
// }

// const LogOut = (props) => {
//     const handleClick = () => (
//         props.logOutCA(),
//         props.setMobileOpenFalseAC()
//     )
//     return (
//         <ListItem button onClick={handleClick}>
//             <ListItemIcon><ExitToAppIcon /></ListItemIcon>
//             <ListItemText primary="Выход" />
//         </ListItem>
//     )
// }

// const mapStateToProps = state => {
//     return {
//         isLoggedIn: state.UI.login
//     }
// }

// export default connect(
//     mapStateToProps,
//     {
//         logOutCA,
//         setMobileOpenFalseAC
//     }
// )(LoginArea)