import { useState } from 'react';
import { connect } from 'react-redux'
import { uploadImage, deleteImage } from '../../redux/actions/dataActions';

import { Button, Card, CardActionArea, CardMedia, Grid, makeStyles, TextField, Typography } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const useStyles = makeStyles((theme) => ({
    del: {
        marginRight: 'auto'
    },
    card: {
        // margin: theme.spacing(1),
    },
    media: {
        //height: '140px',
        backgroundColor: '#dcdcdc',
        paddingTop: '56.25%', // 16:9
    },
    gallery: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gridGap: theme.spacing(1),
    },
}))

const AnotherThumbs = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [errorTitle, setErrorTitle] = useState(false);
    const [errorImage, setErrorImage] = useState(false);
    const [image, setImage] = useState();
    const [item, setItem] = useState();


    const onChangeImage = (event) => {
        setImage(event.target.files[0])
        setErrorImage() //Для отмены предыдущих изменений
    }
    const onSubmit = (event) => {
        event.preventDefault();

        if (image === undefined) {
            return setErrorImage('Обязательное поле')
        } else if (image.type !== 'image/jpeg' && image.type !== 'image/jpg' && image.type !== 'image/png') {
            return setErrorImage('Допустимые форматы JPEG/JPG или PNG')
        } else if (image.size > 3e+6) {
            return setErrorImage('Допустимый размер 3МБ ')
        }

        const formData = new FormData();
        formData.append('image', image, image.name);
        formData.append('item', item);
        formData.append('title', title);
        formData.append('houseId', props.idHouse)
        props.uploadImage(formData);
        // console.log('AnotherThumbs image =>', image)
        // console.log('AnotherThumbs formData =>', formData.get('image'))
        // console.log(window.URL.createObjectURL(image)) // need URL.revokeObjectURL()

        setOpen(false);
        setImage()
    }

    const handleDelete = (evemt) => {
        setOpen(false);
        let data = {}
        data.item = item
        data.houseId = props.idHouse
        props.deleteImage(data)
    }

    const handleOpenModal = (event) => {
        setOpen(true);
        setItem(event.target.id)
    };

    const handleClose = () => {
        setOpen(false);
        setImage()
        setErrorImage(false)
    };

    const handleChangeTitle = (event) => {
        if (event.target.value.length > 20) {
            setErrorTitle(true)
        } else {
            setErrorTitle(false)
        }
        setTitle(event.target.value)
    }

    return (
        <>
            <fieldset>
                <legend>Изображения</legend>
                <Grid item container className={classes.gallery}>
                    {cards.map((card) => (
                        <Card key={card} className={classes.card}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    image={props.images && props.images[card] && props.images[card].urlSmall}
                                    title={props.images?.[card]?.title}
                                    onClick={handleOpenModal}
                                    id={card}
                                />
                            </CardActionArea>

                            <Typography variant="caption" align="center" display="block">
                                {props.images?.[card]?.title}
                            </Typography>
                        </Card>
                    ))}
                </Grid>
            </fieldset>

            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    {props.images[item] ? 'Обновить изображение' : 'Добавить изображение'}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        {' Выберите изображение. Добавьте короткое описание. Например "Фасад".'}
                    </DialogContentText>
                    <TextField
                        required={true}
                        autoFocus
                        margin="dense"
                        id="name"
                        name='image'
                        label="Изображение"
                        type="file"
                        onChange={onChangeImage}
                        helperText={errorImage && errorImage}
                        error={errorImage}
                        fullWidth
                    />
                    <TextField
                        value={title}
                        margin="dense"
                        id="title"
                        label="Описание"
                        type="text"
                        fullWidth
                        onChange={handleChangeTitle}
                        helperText='max 20'
                        error={errorTitle}
                    />
                </DialogContent>
                <DialogActions>
                    {props.images[item] &&
                        <Button onClick={handleDelete} color="secondary" className={classes.del}>
                            {'Удалить'}
                        </Button>}
                    <Button onClick={handleClose} color="default">
                        {'Отмена'}
                    </Button>
                    <Button onClick={onSubmit} color="primary">
                        {props.images[item] ? 'Обновить' : 'Отправить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
};

export default connect(
    null,
    {
        uploadImage,
        deleteImage
    }
)(AnotherThumbs);
