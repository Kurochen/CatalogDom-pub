import { Box, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        "& em": {
            color: theme.palette.primary.main,
            //paddingLeft: theme.spacing(1)
        }
    },
    text: {
        //maxWidth: 500
    }
}));


const EditHouseHelp = () => {
    const classes = useStyles();

    return (
        <Box container className={classes.root} >
            <Typography component='subtitle1' variant='subtitle1' color="primary" gutterBottom display='block'>
                {'Подсказки'}
            </Typography>
            <Grid container spacing={4}>
                <Grid item lg={6} className={classes.text}>
                    <Typography component='p' variant='body' gutterBottom>
                        {'Основные характеристики'}
                    </Typography>
                    <Typography component='p' variant='body' gutterBottom>
                        <em className>{"Подробнее URL -"}</em> {`
                Ссылка на облачный ресурс, где можно разсместить более подробную информацию о проекте (дополнительные фотографии, описание и т.д.)
                    Рекомендуется Google диск, так как на мобильных версиях сайта (Android) переходит автоматическое перенаправление на приложение Google Диск, где очень удобный просиотр файлов.
                    `}
                    </Typography>
                    <Typography component='p' variant='body' gutterBottom>
                        <em>{`Этажность - `}</em> {`Принята сокращенная запись. 0.5 - неполный один этаж. 
                1 - один этаж, плоская кровля либо холодный чердак. 1.5 - полутороэтажный и т.д.`}
                    </Typography>
                    <Typography component='p' variant='body' gutterBottom>
                        <em>{"Длина/Ширина -"}</em> {'Если дом можно построить без веранды - габариты без учета веранды. Длина принята по стороне, где вход в здание.'}
                    </Typography>
                    <Typography component='p' variant='body' gutterBottom>
                        <em>{"Тип строения -"}</em> {'Дом или баня. Если в бане есть кухня и есть где переночевать, то это дом. Хотя, вопрос открытый.'}
                    </Typography>
                    <Typography component='p' variant='body' gutterBottom>
                        <em>{"Изображения -"}</em> {`Рекомендуемый формат изображений: для картинок - JPEG, для планов, разрезов - PNG. Рекомендуемое соотношение сторон - 16:9. Картинки с 
                другим соотношением будут обрезаться. Первая картинка используется для превью в поиске. Там должна быть основная картинка дома. Далее, желательно ставить планы этажей, потом разрезы и остальные.
                `}
                    </Typography>
                </Grid>
                <Grid item lg={6} className={classes.text}>
                    <Typography component='p' variant='body' gutterBottom>
                        {'Стоимость и ссылки'}
                    </Typography>
                    <Typography component='p' variant='body' gutterBottom>
                        <em>{"Стоимость -"}</em>{`
                Максимальная стоимость проекта 35 000 руб.
                Возможны несколько вариантов проекта. Например: только Архитектурная часть, Архитектура плюс Конструктив и третье - Архитектура, Конструктив и Смета. Укажите ссылку на проект.
                Ссылка будет видна только после оплаты проекта.
                `}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default EditHouseHelp
