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

const Derevo = (props) => {
    const classes = useStyles();
    const defaultValues = {    //ToDo - null recieve, bat hook forms has a empty string
        woodType: props.data.woodType || '',
        brusType: props.data.brusType || '',
        brusWidth: props.data.brusWidth || '',
        brusHeight: props.data.brusHeight || '',
        brevnoDiameter: props.data.brevnoDiameter || '',
        widthMaterial: props.data.widthMaterial || '',
        anotherWoodType: props.data.anotherWoodType || ''
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
        console.log('data => ', data)
        //reset(e); // reset after form submit
    };

    const watchDerevo = watch('woodType', props.data.woodType);

    useEffect(() => {
        reset(defaultValues)
    }, [props.changedAt])


    const brusType =
        <>
            <FormControl>
                <InputLabel id="brusType">
                    {'?????? ??????????'}
                </InputLabel>
                <Controller
                    as={
                        <Select>
                            <MenuItem value="????????????"><em>????????????</em></MenuItem>
                            <MenuItem value='??????????????'>{'??????????????'}</MenuItem>
                            <MenuItem value='????????????????????'>{'????????????????????'}</MenuItem>
                            <MenuItem value='????????????????????????????'>{'????????????????????????????'}</MenuItem>
                            <MenuItem value='??????????????'>{'??????????????'}</MenuItem>
                        </Select>
                    }
                    name="brusType"
                    key={'brusType' + props.data.brusType}
                    control={control}
                    labelId='brusType'
                />
            </FormControl>
            <TextField
                label="???????????? ??????????"
                name="brusWidth"
                key={'brusWidth' + props.data.brusWidth}
                type='number'
                inputRef={register({ max: 500, min: 40 })}
                error={errors.brusWidth}
                helperText={errors.brusWidth && 'min 40, max 500'}
                InputProps={{
                    endAdornment: <InputAdornment position="end">????</InputAdornment>,
                }}
            />
            <TextField
                label="???????????? ??????????"
                name="brusHeight"
                key={'brusHeight' + props.data.brusHeight}
                type='number'
                inputRef={register({ max: 500, min: 40 })}
                error={errors.brusHeight}
                helperText={errors.brusHeight && 'min 40, max 500'}
                InputProps={{
                    endAdornment: <InputAdornment position="end">????</InputAdornment>,
                }}
            />
        </>

    const brevnoType =
        <TextField
            label="?????????????? ????????????"
            name="brevnoDiameter"
            key={'brevnoDiameter' + props.data.brevnoDiameter}
            type='number'
            inputRef={register({ max: 500, min: 80 })}
            error={errors.brevnoDiameter}
            helperText={errors.brevnoDiameter && 'min 80, max 500'}
            InputProps={{
                endAdornment: <InputAdornment position="end">????</InputAdornment>,
            }}
        />

    const widthMaterial =
        <TextField
            key={'widthMaterial' + props.data.widthMaterial}
            label="????????????"
            name="widthMaterial"
            type='number'
            inputRef={register({ min: 5, max: 1500 })}
            error={errors.widthMaterial}
            helperText={errors.widthMaterial && 'min 5, max 1500'}
            InputProps={{
                endAdornment: <InputAdornment position="end">????</InputAdornment>,
            }}
        />
    const anotherWoodType =
        <>
            <TextField
                key={'anotherWoodType' + props.data.anotherWoodType}
                label="??????"
                name="anotherWoodType"
                inputRef={register({ maxLength: 20 })}
                error={errors.anotherWoodType}
                helperText={errors.anotherWoodType && 'max 20'}

            />
            {widthMaterial}
        </>

    return (
        <form className={classes.root}  >
            <FormControl >
                <InputLabel id="woodType">
                    {'??????'}
                </InputLabel>
                <Controller
                    as={
                        <Select>
                            <MenuItem value="????????????"><em>????????????</em></MenuItem>
                            <MenuItem value='????????'>{'????????'}</MenuItem>
                            <MenuItem value='????????????'>{'????????????'}</MenuItem>
                            <MenuItem value='????????????'>{'????????????'}</MenuItem>
                            <MenuItem value='????????????'>{'????????????'}</MenuItem>
                        </Select>
                    }
                    name="woodType"
                    key={'woodType' + props.data.woodType}
                    control={control}
                    labelId='woodType'
                />
            </FormControl>
            {watchDerevo === '????????' ? brusType : false}
            {watchDerevo === '????????????' ? brevnoType : false}
            {watchDerevo === '????????????' ? widthMaterial : false}
            {watchDerevo === '????????????' ? widthMaterial : false}
            {watchDerevo === '????????????' ? anotherWoodType : false}


            <Box className={classes.buttons}>
                <Button
                    variant="contained"
                    //disabled={!formState.isDirty}
                    disabled={(Object.entries(formState.dirtyFields).length < 1)}
                    color="primary"
                    onClick={handleSubmit(onSubmit)}>
                    {'??????????????????'}
                </Button>
                <Button
                    variant="contained"
                    //disabled={!formState.isDirty}
                    disabled={(Object.entries(formState.dirtyFields).length < 1)}
                    onClick={() => reset()}>
                    {"????????????"}
                </Button>
            </Box>
        </form>
    )
};


export default connect(
    null,
    { editMaterial }
)(Derevo)

