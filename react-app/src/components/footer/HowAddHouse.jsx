import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: '600px',
        //whiteSpace: 'pre-line' // Абзацы
    },
}));

const HowAddHouse = () => {
    const classes = useStyles();

    const link = <Link target="_blank" rel="noreferrer" href="https://vk.com/id93746972">Вконтакте</Link>
    return (
        <Box className={classes.root}>
            <Typography component='h1' variant='h5' color="primary" gutterBottom>
                {'Как добавить проект'}
            </Typography>
            <Typography component='p' variant='body2' gutterBottom>
                {'Зарегистрируйтесь или войдите при помощи Google.'}
            </Typography>
            <Typography component='p' variant='body2' gutterBottom>
                {`
                Заполните в профиле данные о себе. Добавьте пару проектов. 
                После чего - пишите мне`} {link} {`, укажите свои ссылки на фриланс биржах и соц.сетях. Ваш профиль будет проверен.
                `}
            </Typography>
            <Typography component='p' variant='body2' gutterBottom>
                {'Клиент, подобрав по параметрам проект, может купить его у вас напрямую. Получив ссылку на скачивание сразу после оплаты.'}
            </Typography>
        </Box>
    )
}

export default HowAddHouse

//https://vk.com/id93746972