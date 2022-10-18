import { Box, Button, InputAdornment, TextField } from "@material-ui/core";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { editMaterial } from '../../../redux/actions/dataActions'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            marginBottom: theme.spacing(2),
            marginRight: theme.spacing(3),
            minWidth: 210,
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

const Kirpich = (props) => {
    const classes = useStyles();
    const defaultValue = {
        widthMaterial: props.data.widthMaterial,
    }
    const { register,
        handleSubmit,
        reset,
        formState,
        errors } = useForm({ defaultValue: defaultValue }); //mode: "all"

    const onSubmit = async (data, e) => {
        // const dirtyData = {};
        // Object.entries(formState.dirtyFields).forEach(dirtyField => {
        //     dirtyData[dirtyField[0]] = data[dirtyField[0]];
        // })
        data.houseId = props.idHouse
        props.editMaterial(data);
        reset(e); // reset after form submit
    };

    //const watchKirpich = watch('brickType', props.data.derevo.type);


    useEffect(() => {
        reset(defaultValue)
    }, [props.changedAt])

    const widthMaterial =
        <TextField
            label="Ширина"
            name="widthMaterial"
            type='number'
            inputRef={register({ min: 5, max: 1500 })}
            error={errors.widthMaterial}
            helperText={errors.widthMaterial && 'min 5, max 1500'}
            InputProps={{
                endAdornment: <InputAdornment position="end">мм</InputAdornment>,
            }}
        />

    return (
        <form className={classes.root} >
            {widthMaterial}
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
    )
};

export default connect(
    null,
    { editMaterial }
)(Kirpich)

