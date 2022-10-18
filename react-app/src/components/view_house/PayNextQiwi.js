import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { createBillQiwiPay } from '../../redux/actions/uiActions'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { Card, Typography, CardContent, Grid, FormGroup, CardActions, Button, TextField } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    fieldset: {
        border: 'none',
        marginTop: theme.spacing(2),
    },
}));

const PayNextQiwi = (props) => {
    //console.log('payNext props=>', props)
    const classes = useStyles();
    const initialState = {
        payButtonDisable: true,
        logIn: true,
        userPhone: '',
        userName: ''
    }
    const [state, setState] = useState(initialState)

    useEffect(() => {
        if (props.userId === null || props.userId === 'anonymous') {
            setState({ ...state, logIn: false });
        } else {
            setState({ ...state, payButtonDisable: false });
        }
    }, [])


    const handleChangeText = (event) => {
        setState({ ...state, [event.target.id]: event.target.value });
    };

    const logInisTrue =
        <Typography variant="body2" inline="true">
            {`Для продолжения необходима регистрация через сервис Google.`}
        </Typography>


    return (
        <Grid item xs>
            <Card>
                <CardContent>
                    <Typography variant="subtitle1" component="h2">
                        {props.data[1].title}
                    </Typography>
                    <Typography variant="body2" inline="true">
                        {`Вы будете перенаправлены на страницу QIWI.`}
                    </Typography>
                    <Typography variant="body2" inline="true">
                        {`Комиссия сервиса QIWI - 2%.`}
                    </Typography>
                    <Typography variant="body2" inline="true">
                        {`После оплаты, ссылка на проект повится в профиле, в разделе 'Мои проекты'.`}
                    </Typography>

                    <fieldset className={classes.fieldset}>
                        <legend>
                            <Typography variant="body2" inline="true">
                                {'Дополнительные данные о себе:'}
                            </Typography>
                            <Typography variant="caption" inline="true">
                                {'(По желанию)'}
                            </Typography>
                        </legend>
                        <FormGroup>
                            <TextField
                                id="userPhone"
                                label="Номер телефона"
                                value={state.userPhone}
                                onChange={handleChangeText}
                            />
                            <TextField
                                id="userName"
                                label="Имя"
                                value={state.userName}
                                onChange={handleChangeText}
                            />
                        </FormGroup>
                    </fieldset>
                    {!state.logIn && logInisTrue}
                </CardContent>
                <CardActions>
                    <Button
                        disabled={state.payButtonDisable}
                        variant="outlined"
                        color="primary"
                        startIcon={<AccountBalanceWalletIcon />}
                        onClick={() => props.createBillQiwiPay({
                            userName: state.userName,
                            userPhone: state.userPhone,
                            houseId: props.idHouse,
                            payId: props.data[0],
                            sellerId: props.dataHouse.userId
                        })}
                    >
                        {props.data[1].price && `${props.data[1].price.toLocaleString()} руб`}
                    </Button>
                    <Button
                        variant="outlined"
                        color="default"
                        onClick={() => props.handleClick(null)}
                    >
                        {'Отмена'}
                    </Button>
                </CardActions>
            </Card>
        </Grid >
    )
}

const mapStateToProps = state => {
    return {
        userId: state.UI.uid
    }
}

export default connect(
    mapStateToProps,
    {
        createBillQiwiPay
    }
)(PayNextQiwi)