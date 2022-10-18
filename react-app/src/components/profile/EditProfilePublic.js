import React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from "react-hook-form";
import { setUserProfileDB, getUserProfileDB } from '../../redux/actions/userDataActions'
import { setBackdropOnAC, setBackdropOffAC } from '../../redux/actions/uiActions'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box"
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
    root: {
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

const EditProfilePublic = (props) => {
    const classes = useStyles();

    const defaultValues = {
        name: props.user.name || '',
        linkVK: props.user.linkVK || '',
        linkFH: props.user.linkFH || '',
        city: props.user.city || '',
        bio: props.user.bio || '',
    }
    const { register,
        handleSubmit,
        reset,
        formState,
        errors } = useForm({ defaultValues: defaultValues, mode: "all" });

    const onSubmit = (data, e) => {
        const dirtyData = {};
        Object.entries(formState.dirtyFields).forEach(dirtyField => {
            dirtyData[dirtyField[0]] = data[dirtyField[0]];
        })
        props.setUserProfileDB(dirtyData);
        //reset(e); // reset after form submit
    };

    useEffect(() => {
        if (props.uid !== null) { // get data profile after recieve uid from authorization
            props.getUserProfileDB(props.uid);
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
            <legend>Публичные данные</legend>
            <form className={classes.root} autoComplete="off" >
                <TextField
                    label="ФИО"
                    key={'name' + props.user.name}
                    name="name"
                    fullWidth={true}
                    inputRef={register({ maxLength: 50 })}
                    error={errors.name}
                    helperText={
                        errors.name && 'Максимум 50 символов.'
                    }
                />
                {/* {errors.name?.type === "maxLength" &&
                    "Your input exceed maxLength"} */}
                <TextField
                    label="Горорд"
                    key={'city' + props.user.city}
                    name="city"
                    inputRef={register}
                />
                <TextField
                    label="Ссылка ForumHouse"
                    name="linkFH"
                    key={'linkFH' + props.user.linkFH}
                    inputRef={register}
                    fullWidth={true}
                />
                <TextField
                    label="Ссылка ВК"
                    key={'linkVK' + props.user.linkVK}
                    name="linkVK"
                    inputRef={register}
                    fullWidth={true}
                />
                <TextField
                    label="О себе"
                    key={'bio' + props.user.bio}
                    name="bio"
                    multiline={true}
                    fullWidth={true}
                    inputRef={register}
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
        user: state.userData.user
    }
}

export default connect(
    mapStateToProps,
    {
        setUserProfileDB,
        getUserProfileDB,
        setBackdropOnAC,
        setBackdropOffAC
    }
)(EditProfilePublic)