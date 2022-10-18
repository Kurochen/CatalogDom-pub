import Input from '@material-ui/core/Input';
import { Button, makeStyles, TextField } from '@material-ui/core';
//Redux
import { connect } from 'react-redux'
import { uploadImage } from '../redux/actions/dataActions';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
            margin: theme.spacing(1),
        },
    },

    img: {
        width: '100%',
    },
    gallery: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gridGap: theme.spacing(1),
    },
}))



const AddImage = (props) => {
    const classes = useStyles();

    const formData = new FormData();
    let image;

    const onChangeImage = (event) => {
        image = event.target.files[0];
    }
    const onSubmit = (event) => {
        event.preventDefault();
        formData.append('image', image, image.name);
        formData.append('test', 'testValueKur');
        formData.append('test22', test)
        props.uploadImage(formData);
    }

    return (
        <form id="formElem" className={classes.root}>
            <Input type='file' accept="image/*" onChange={onChangeImage}></Input>
            <TextField type="text" name="name" value="John" label={"Описание"} variant="outlined" size="small"></TextField>
            <Button
                type="submit"
                onClick={onSubmit}
                variant="outlined"
                color='primary'
            >
                {'Отправить'}
            </Button>
        </form>
    )
}




export default connect(
    null,
    { uploadImage }
)(AddImage);
