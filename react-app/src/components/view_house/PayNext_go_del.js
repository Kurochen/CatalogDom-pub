import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { payYoomoney, getPayNumber } from '../../redux/actions/uiActions'

import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { Card, Typography, CardContent, Grid, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, CardActions, Button, } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    fieldset: {
        // border: 'none',
        marginTop: theme.spacing(2),
    },
}));

const PayNext = (props) => {
    //console.log('payNext =>', `${props.userId}_${props.idHouse}_${props.data[0]}`)
    const classes = useStyles();
    const initialState = {
        paymentType: 'AC',
        needFIO: false,
        needEmail: false,
        needPhone: true,
        payNumber: '',
        payButton: true,
        logIn: true
    }
    const [state, setState] = useState(initialState)

    useEffect(() => {
        const fetchNumberPay = async () => {
            const customer = await getPayNumber(props.dataHouse.userId);
            if (customer.payNumber) {
                setState({ ...state, payNumber: customer.payNumber, payButton: false });
            }
        }
        if (props.userId === null) {
            setState({ ...state, logIn: false });
        } else {
            fetchNumberPay()
        }

    }, [])


    const handleChangeRadio = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const handleChangeCheckbox = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const logIn =
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
                        {`Вы будете перенаправлены на ЮMoney (ЯндексДеньги).`}
                    </Typography>
                    <Typography variant="body2" inline="true">
                        {`После оплаты, ссылка на проект повится в профиле, в разделе 'Мои проекты'.`}
                    </Typography>
                    <fieldset className={classes.fieldset}>
                        <legend>
                            <Typography variant="body2" component="h3">
                                {'Способ оплаты:'}
                            </Typography>
                        </legend>
                        <RadioGroup aria-label="payNext" name='paymentType' value={state.paymentType} onClick={handleChangeRadio} >
                            <FormControlLabel
                                value={'AC'}
                                label={'Карта'}
                                control={<Radio color="primary" />}
                            />
                            <FormControlLabel
                                value={'PC'}
                                label={'Кошелек ЮMoney'}
                                control={<Radio color="primary" />}
                            />
                        </RadioGroup>
                    </fieldset>

                    <fieldset className={classes.fieldset}>
                        <legend>
                            <Typography variant="body2" component="h3" inline="true">
                                {'Дополнительные данные о себе:'}
                            </Typography>

                        </legend>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={state.needPhone}
                                    onChange={handleChangeCheckbox}
                                    name='need-phone'
                                    color="primary" />}
                                label={'Номер телефона'}
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    checked={state.needEmail}
                                    onChange={handleChangeCheckbox}
                                    name='need-email'
                                    color="primary" />}
                                label={'Электронная почта'}
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    checked={state.needFIO}
                                    onChange={handleChangeCheckbox}
                                    name='need-fio'
                                    color="primary" />}
                                label={'ФИО'}
                            />
                        </FormGroup>
                    </fieldset>
                    {!state.logIn && logIn}
                </CardContent>
                <CardActions>
                    <form method="POST" action="https://yoomoney.ru/quickpay/confirm.xml" >

                        <input type="hidden" name="receiver" value={state.payNumber} />
                        <input type="hidden" name="formcomment" value={`${props.dataHouse.name} от ${props.dataHouse.userEmail}`} />
                        <input type="hidden" name="short-dest" value={`${props.dataHouse.name} от ${props.dataHouse.userEmail}`} />
                        <input type="hidden" name="label" value={`${props.userId}_${props.idHouse}_${props.data[0]}`} />
                        <input type="hidden" name="quickpay-form" value="donate" />
                        <input type="hidden" name="targets" value={`${props.dataHouse.name} (${props.data[1].title}) ${props.dataHouse.userEmail}`} />
                        <input type="hidden" name="sum" value={props.data[1].price} data-type="number" />
                        {/* <input type="hidden" name="comment" value="Хотелось бы дистанционного управления." /> */}
                        <input type="hidden" name="need-fio" value={state.needFIO} />
                        <input type="hidden" name="need-email" value={state.needEmail} />
                        <input type="hidden" name="need-phone" value={state.needPhone} />
                        {/* <input type="hidden" name="need-address" value="false" /> */}
                        <input type="hidden" name="paymentType" value={state.paymentType} />
                        <Button
                            disabled={state.payButton}
                            //type='submit'
                            variant="outlined"
                            color="primary"
                            startIcon={<AccountBalanceWalletIcon />}
                            onClick={(e) => { props.payYoomoney(e, props.dataHouse.userId) }}
                        >
                            {props.data[1].price && `${props.data[1].price.toLocaleString()} руб`}
                        </Button>
                    </form>

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
        payYoomoney,
        getPayNumber,
    }
)(PayNext)