import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import React, { useEffect } from "react"
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

const Beton = (props) => {
    const classes = useStyles();
    const defaultValues = {
        concreteType: props.data.concreteType || '',
        widthMaterial: props.data.widthMaterial,
        anotherConcreteType: props.data.anotherConcreteType
    }
    const { register,
        handleSubmit,
        reset,
        formState,
        errors,
        watch,
        control } = useForm({ defaultValues: defaultValues }); //mode: "all"

    const onSubmit = async (data, e) => {
        // const dirtyData = {};
        // Object.entries(formState.dirtyFields).forEach(dirtyField => {
        //     dirtyData[dirtyField[0]] = data[dirtyField[0]];
        // })
        data.houseId = props.idHouse
        props.editMaterial(data);
        //reset(e); // reset after form submit
    };

    const watchBeton = watch('concreteType', props.data.concrete);

    useEffect(() => {
        reset(defaultValues)
    }, [props.changedAt])

    const widthMaterial =
        <TextField
            key={'widthMaterial' + props.data.widthMaterial}
            label="Ширина материала"
            name="widthMaterial"
            type='number'
            inputRef={register({ min: 5, max: 1500 })}
            error={errors.widthMaterial}
            helperText={errors.widthMaterial && 'min 5, max 1500'}
            InputProps={{
                endAdornment: <InputAdornment position="end">мм</InputAdornment>,
            }}
        />

    const anotherConcreteType =
        <>
            <TextField
                key={'anotherConcreteType' + props.data.anotherConcreteType}
                label="Марка"
                name="anotherConcreteType"
                type='text'
                inputRef={register({ maxLength: 20 })}
                error={errors.anotherConcreteType}
                helperText={errors.anotherConcreteType && 'max 20'}
            />
            {widthMaterial}
        </>

    return (
        <form className={classes.root} >
            <FormControl >
                <InputLabel id="concreteType">
                    {'Тип'}
                </InputLabel>
                <Controller
                    as={
                        <Select>
                            <MenuItem value="Другое"><em>Другое</em></MenuItem>
                            <MenuItem value='Каркас'>{'Каркас'}</MenuItem>
                            <MenuItem value='Монолит'>{'Монолит'}</MenuItem>
                        </Select>
                    }
                    key={'concreteType' + props.data.concreteType}
                    name="concreteType"
                    control={control}
                    labelId='concreteType'
                />
            </FormControl>
            {watchBeton === 'Монолит' ? widthMaterial : false}
            {watchBeton === 'Каркас' ? widthMaterial : false}
            {watchBeton === 'Другое' ? anotherConcreteType : false}

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
)(Beton)

