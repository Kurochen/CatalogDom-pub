import { useEffect, useState } from 'react';

import { Typography, Button, Box, makeStyles } from '@material-ui/core';
import { Redirect } from 'react-router'
import {
    GoogleAuthProvider,
    getAuth,
    signInWithRedirect,
    getRedirectResult
} from "firebase/auth";

const useStyles = makeStyles((theme) => ({
    buttonBox: {
        paddingTop: theme.spacing(2)
    },
    button: {
        display: 'block',
        margin: 'auto'
    }
}))


const provider = new GoogleAuthProvider();
const auth = getAuth();
auth.languageCode = 'ru';

const hundleSubmit = () => {
    signInWithRedirect(auth, provider);
}


const Login = () => {
    const classes = useStyles();

    const [loginOn, setLoginOn] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        //
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    setLoginOn(true)
                }
            }).catch((error) => {
                setErrorMessage(error.message)
            })
    }, [])

    const loginTrue = <Redirect to='/' />
    const loginFalse =
        <>
            <Typography component='h1' variant='h5' color="primary" gutterBottom>
                {'Регистрация / вход'}
            </Typography>
            <Box className={classes.buttonBox}>
                <Button onClick={hundleSubmit} color="primary" variant="outlined" className={classes.button}>
                    Войти с помощью Google
                </Button>
            </Box>
        </>
    const loginError =
        <>
            <Typography component='h1' variant='h5' color="primary" gutterBottom>
                {'При регистрации произошла ошибка'}
            </Typography>
            <Typography component='p' variant='body1' color="primary" gutterBottom>
                {errorMessage}
            </Typography>

        </>

    let render;
    if (errorMessage) {
        render = loginError
    } else if (loginOn) {
        render = loginTrue
    } else {
        render = loginFalse
    }
    return render
}

export default Login