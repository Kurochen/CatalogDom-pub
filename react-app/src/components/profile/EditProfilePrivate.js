import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from "react-hook-form";
import { setUserPrivateProfileDB, getUserPrivateProfileDB } from '../../redux/actions/userDataActions'
import { setBackdropOnAC, setBackdropOffAC } from '../../redux/actions/uiActions'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box"
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
    form: {
        '& > *': {
            marginBottom: theme.spacing(2),
            marginRight: theme.spacing(3),
            minWidth: 120,
        },
    },
    buttons: {
        float: 'right',
        marginTop: theme.spacing(2),
        '& > *': {
            marginLeft: theme.spacing(2),
        }
    }
}));

const EditProfilePrivate = (props) => {
    const classes = useStyles();

    const defaultValues = {
        phone: props.user.phone || '',
        publicKeyQiwi: props.user.publicKeyQiwi || '',
        secretKeyQiwi: props.user.secretKeyQiwi || '',

    }
    const { register,
        handleSubmit,
        reset,
        formState,
        errors } = useForm({ defaultValues: { defaultValues } });

    const onSubmit = (data, e) => {
        const dirtyData = {};
        Object.entries(formState.dirtyFields).forEach(dirtyField => {
            dirtyData[dirtyField[0]] = data[dirtyField[0]];
        })

        props.setUserPrivateProfileDB(dirtyData);
        //reset(e); // reset after form submit
    };

    useEffect(() => {
        if (props.uid !== null) { // get data profile after recieve uid from authorization
            props.getUserPrivateProfileDB(props.uid);
            props.setBackdropOffAC()
        } else {
            props.setBackdropOnAC()
        }
    }, [props.uid]);

    useEffect(() => {
        reset(defaultValues)
    }, [props.user.changedAt])


    return (
        <fieldset>
            <legend>Приватные данные</legend>
            <form className={classes.form} autoComplete="off" >
                <TextField
                    label="Публичный ключ"
                    key={"publicKeyQiwi" + props.user.publicKeyQiwi}
                    name="publicKeyQiwi"
                    fullWidth={true}
                    inputRef={register({ maxLength: 189, minLength: 189 })}
                    error={errors.publicKeyQiwi}
                    helperText={
                        errors.publicKeyQiwi && 'Неверная длина ключа'
                    }
                />
                {/* {errors.name?.type === "maxLength" &&
                    "Your input exceed maxLength"} */}
                <TextField
                    label="Приватный ключ"
                    key={"secretKeyQiwi" + props.user.secretKeyQiwi}
                    name="secretKeyQiwi"
                    fullWidth={true}
                    inputRef={register({ maxLength: 220, minLength: 220 })}
                    error={errors.secretKeyQiwi}
                    helperText={
                        errors.secretKeyQiwi && 'Неверная длина ключа'
                    }
                />
                <TextField
                    label="Номер телефона"
                    key={"phone" + props.user.phone}
                    name="phone"

                    inputRef={register({ maxLength: 14, minLength: 5 })}
                    error={errors.phone}
                    helperText={
                        errors.phone && 'Номер странный'
                    }
                />

                <Box className={classes.buttons}>
                    <Button
                        variant="contained"
                        disabled={!formState.isDirty}
                        color="primary"
                        onClick={handleSubmit(onSubmit)}>
                        {'Сохранить'}
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!formState.isDirty}
                        onClick={() => reset()}>
                        {"Отмена"}
                    </Button>
                </Box>
            </form>
        </fieldset>
    )
}

const mapStateToProps = state => {
    return {
        uid: state.UI.uid,
        user: state.userData.userPrivate
    }
}

export default connect(
    mapStateToProps,
    {
        setUserPrivateProfileDB,
        getUserPrivateProfileDB,
        setBackdropOnAC,
        setBackdropOffAC
    }
)(EditProfilePrivate)
