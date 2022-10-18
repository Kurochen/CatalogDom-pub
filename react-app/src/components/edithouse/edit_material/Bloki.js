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

const Bloki = (props) => {
    const classes = useStyles();
    const defaultValues = {
        blockType: props.data.blockType || '',
        keramikaType: props.data.keramikaType,
        widthMaterial: props.data.widthMaterial,
        anotherBlockType: props.data.anotherBlockType || ''
    }
    const { register,
        handleSubmit,
        reset,
        formState,
        errors,
        watch,
        control } = useForm({ defaultValues: defaultValues });

    const onSubmit = async (data, e) => {
        // const dirtyData = {};
        // Object.entries(formState.dirtyFields).forEach(dirtyField => {
        //     dirtyData[dirtyField[0]] = data[dirtyField[0]];
        // })
        data.houseId = props.idHouse
        props.editMaterial(data);
        //reset(e); // reset after form submit
    };

    const watchBloki = watch('blockType', props.data.blockType);

    useEffect(() => {
        reset(defaultValues)
    }, [props.changedAt])


    const widthMaterial =
        <TextField
            key={'widthMaterial' + props.data.widthMaterial}
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
    const anotherBlockType =
        <>
            <TextField
                key={'anotherBlockType' + props.data.anotherBlockType}
                label="Марка"
                name="anotherBlockType"
                type='text'
                inputRef={register({ maxLength: 20 })}
                error={errors.anotherBlockType}
                helperText={errors.anotherBlockType && 'max 20'}
            />
            {widthMaterial}
        </>
    const keramikaType =
        <>
            <TextField
                key={'keramikaType' + props.data.keramikaType}
                label="Марка"
                name="keramikaType"
                type='text'
                inputRef={register({ maxLength: 20 })}
                error={errors.keramikaType}
                helperText={errors.keramikaType && 'max 20'}
            />
            {widthMaterial}
        </>

    return (
        <form className={classes.root} >
            <FormControl >
                <InputLabel id="blockType">
                    {'Тип'}
                </InputLabel>
                <Controller
                    as={
                        <Select>
                            <MenuItem value="Другое"><em>Другое</em></MenuItem>
                            <MenuItem value='Пенобетон'>{'Пенобетон'}</MenuItem>
                            <MenuItem value='Газобетон'>{'Газобетон'}</MenuItem>
                            <MenuItem value='Керамика'>{'Керамика'}</MenuItem>
                            <MenuItem value='Арболит'>{'Арболит'}</MenuItem>
                        </Select>
                    }
                    name="blockType"
                    control={control}
                    labelId='blockType'
                />
            </FormControl>
            {watchBloki === 'Другое' ? anotherBlockType : false}
            {watchBloki === 'Пенобетон' ? widthMaterial : false}
            {watchBloki === 'Газобетон' ? widthMaterial : false}
            {watchBloki === 'Керамика' ? keramikaType : false}
            {watchBloki === 'Арболит' ? widthMaterial : false}

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
)(Bloki)

