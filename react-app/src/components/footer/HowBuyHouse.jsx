import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '600px',
        whiteSpace: 'pre-line'
    },
}));

const HowBuyHouse = () => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Typography component='h1' variant='h5' color="primary" gutterBottom>
                {'Как купить проект'}
            </Typography>
            <Typography component='p' variant='body2' gutterBottom>
                {'Зарегистрируйтесь или войдите при помощи Google.'}
            </Typography>
            <Typography component='p' variant='body2' gutterBottom>
                {`Выберите понравившийся проект. Нажмите оплатить. Вы будете перенаправлены на сайт QIWI. После оплаты, ссылка на проект появится в профиле "Мои проекты".
                QIWI дополнительно возьмет комиссию 2%.
                
                Каждый новый продавец на сайте проверятся. Тем не менее, покупка проекта осуществляется на свой страх и риск. 
                `}
            </Typography>
        </Box>
    )
}

export default HowBuyHouse
