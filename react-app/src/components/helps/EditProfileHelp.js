import { Box, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '600px',
        "& em": {
            color: theme.palette.primary.main,
        }
    },
}));


const EditProfileHelp = () => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Typography component='subtitle1' variant='subtitle1' color="primary" gutterBottom display='block'>
                {'Подсказки'}
            </Typography>
            <Typography component='p' variant='body' gutterBottom>
                {'Чем больше информации о себе, тем больше доверия потенциальных покупателей'}
            </Typography>

            <Typography component='p' variant='body' gutterBottom>
                <em>{`Публичные и приватные ключи -`}</em> {'Получить можно по этой '} <Link href="https://qiwi.com/p2p-admin/transfers/api" target="_blank" rel="noopener">
                    {`ссылке. `}
                </Link>
                {`В разделе "Аутентификационные данные" нажать "Создать пару ключей и настроить". Галочку напротив "Использовать эту пару ключей ..." ставить не надо.
                Данная пара используется для выставления и проверки оплаты счетов. 
                `}
            </Typography>
            <Typography component='p' variant='body' gutterBottom>
                <em>{`Номер телефона -`}</em> {'По желанию. Виден после покупки проекта.'}
            </Typography>
            <Typography component='p' variant='body' gutterBottom>
                {'Не забывайте про статус кошелька QIWI. В минимальном статусе лимит на перевод 15 000. Рекомендуется обновить до "Основного" статуса, где лимит - 60 000.'}
            </Typography>
        </Box>
    )
}

export default EditProfileHelp
