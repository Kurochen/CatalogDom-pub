import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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

const Drugoe = (props) => {
    const classes = useStyles();
    const defaultValues = {
        widthMaterial: props.data.widthMaterial || '',
        materialAnotherType: props.data.materialAnotherType || '',
    }
    const { register,
        handleSubmit,
        reset,
        formState,
        errors } = useForm(defaultValues); //mode: "all"

    const onSubmit = async (data, e) => {
        // let dirtyData = {};
        // Object.entries(formState.dirtyFields).forEach(dirtyField => {
        //     dirtyData[dirtyField[0]] = data[dirtyField[0]];
        // })
        data.houseId = props.idHouse
        props.editMaterial(data);
        //reset(e); // reset after form submit
    };

    //const watchDerevo = watch('type', props.data.derevo.type);


    useEffect(() => {
        reset(defaultValues)
    }, [props.changedAt])

    const widthMaterial =
        <TextField
            key={'widthMaterial' + props.data.widthMaterial}
            label="Ширина материала"
            name="widthMaterial"
            type='number'
            inputRef={register({ max: 1500, min: 5 })}
            error={errors.widthMaterial}
            helperText={errors.widthMaterial && 'min 5, max 1500'}
            InputProps={{
                endAdornment: <InputAdornment position="end">мм</InputAdornment>,
            }}
        />
    const materialAnotherType =
        <TextField
            key={'materialAnotherType' + props.data.materialAnotherType}
            label="Материал"
            name="materialAnotherType"
            inputRef={register({ minLength: 2, maxLength: 15 })}
            error={errors.materialAnotherType}
            helperText={errors.materialAnotherType && 'min 2, max 15'}
        />
    return (
        <form className={classes.root} autoComplete="off" >
            {materialAnotherType}
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
)(Drugoe)


