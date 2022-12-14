import React from 'react';
import { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import {
    FormControl, Button, Box,
    TextField, InputLabel,
    Select, MenuItem,
    FormHelperText, InputAdornment, Switch,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { editMainAtributes } from '../../redux/actions/dataActions'


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

const MainAtributes = (props) => {
    const classes = useStyles();
    const defaultValues = {
        name: props.data.name || '',
        area: props.data.area || '',
        floors: props.data.floors || '',
        length: props.data.length || '',
        width: props.data.width || '',
        roof: props.data.roof || '',
        foundation: props.data.foundation || '',
        material: props.data.material?.name || '',
        typeBuilding: props.data.typeBuilding || '',
        description: props.data.description || '',
        descriptionURL: props.data.descriptionURL || '',
        visible: props.data.visible || false,
    }
    const { register,
        handleSubmit,
        reset,
        formState,
        errors,
        control,
    } = useForm({
        defaultValues: defaultValues
    });

    const onSubmit = async (data) => {
        let dirtyData = {};
        Object.entries(formState.dirtyFields).forEach(dirtyField => {
            dirtyData[dirtyField[0]] = data[dirtyField[0]];
        })
        dirtyData.houseId = props.idHouse
        props.editMainAtributes(dirtyData);
        console.log("MainAtributes dirtyData => ", dirtyData)
        //console.log("props.idHouse")
        //reset(); // reset after form submit
    };

    useEffect(() => {
        reset(defaultValues)
    }, [props.data.changedAt])

    // useEffect(() => {
    //     console.log('dirtyFields =>', formState.dirtyFields)
    // }, [formState])

    return (
        <fieldset>
            <legend>???????????????? ????????????????????????????</legend>
            <form className={classes.root}  >
                <TextField
                    label="???????????????? (13 max)"
                    name="name"
                    key={'name' + props.data.name}
                    //defaultValue={props.data.name}
                    fullWidth={true}
                    inputRef={register({ maxLength: 13, minLength: 1 })}
                    error={errors.name}
                    helperText={
                        errors.name && 'max 13 min 1'
                    }
                />
                <TextField
                    label="?????????????? ????????????????"
                    name="description"
                    key={'description' + props.data.description}
                    fullWidth={true}
                    multiline={true}
                    inputRef={register({ maxLength: 1000 })}
                    error={errors.description}
                    helperText={
                        errors.description && 'max 1000'
                    }
                />

                <TextField
                    label="?????????????????? URL"
                    name="descriptionURL"
                    type="url"
                    key={'descriptionURL' + props.data.descriptionURL}
                    inputRef={register({ maxLength: 500 })}
                    error={errors.descriptionURL}
                    helperText={
                        errors.descriptionURL && 'max 500'
                    }
                />


                < TextField
                    label="??????????????"
                    name="area"
                    key={'area' + props.data.area}
                    //defaultValue={props.data.area}
                    type='number'
                    inputRef={register({ max: 3000, min: 10 })}
                    error={errors.area}
                    helperText={errors.area && 'min 10, max 300'}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">m&#178;</InputAdornment>,
                    }}
                />
                <TextField
                    label="??????????????????(3 max)"
                    name="floors"
                    key={'floors' + props.data.floors}
                    //defaultValue={props.data.floors}
                    type='number'
                    inputRef={register({ pattern: /^(0.5|1|1.5|2|2.5|3)$/ })}
                    error={errors.floors}
                    helperText={errors.floors && '0,5, 1, 1,5 ...'}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">????.</InputAdornment>,
                    }}
                />

                <TextField
                    label="??????????"
                    name="length"
                    key={'length' + props.data.length}
                    //defaultValue={props.data.length}
                    type='number'
                    inputRef={register({ min: 1, max: 30 })}
                    error={errors.length}
                    helperText={errors.length && 'min 1, max 30'}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">??.</InputAdornment>,
                    }}
                />
                <TextField
                    label="????????????"
                    name="width"
                    key={'width' + props.data.width}
                    //defaultValue={props.data.width}
                    type='number'
                    inputRef={register({ min: 1, max: 30 })}
                    error={errors.width}
                    helperText={errors.width && 'min 1, max 30'}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">??.</InputAdornment>,
                    }}
                />

                {/* Foundation */}
                <FormControl >
                    <InputLabel id="foundation">
                        {'??????????????????'}
                    </InputLabel>
                    <Controller
                        as={
                            <Select>
                                <MenuItem value="????????????"><em>????????????</em></MenuItem>
                                <MenuItem value='??????????'>{'??????????'}</MenuItem>
                                <MenuItem value='????????'>{'????????'}</MenuItem>
                                <MenuItem value='??????????'>{'??????????'}</MenuItem>
                                <MenuItem value='????????????'>{'????????????'}</MenuItem>
                            </Select>
                        }
                        name="foundation"
                        key={'foundation' + props.data.foundation}
                        //defaultValue={props.data.foundation}
                        control={control}
                        labelId='foundation'
                    />
                </FormControl>

                {/* Roof */}
                <FormControl>
                    <InputLabel id="roof">
                        {'????????????'}
                    </InputLabel>
                    <Controller
                        as={
                            <Select >
                                <MenuItem value="????????????"><em>????????????</em></MenuItem>
                                <MenuItem value='????????????'>{'????????????'}</MenuItem>
                                <MenuItem value='??????????????????????'>{'??????????????????????'}</MenuItem>
                                <MenuItem value='??????????????????????'>{'??????????????????????'}</MenuItem>
                                <MenuItem value='????????????????????????????'>{'????????????????????????????'}</MenuItem>
                            </Select>
                        }
                        name="roof"
                        key={'roof' + props.data.roof}
                        //defaultValue={props.data.roof}
                        control={control}
                        labelId='roof'
                    />
                </FormControl>

                {/* ?????? ???????????????? */}
                <FormControl>
                    <InputLabel id="typeBuilding">
                        {'?????? ????????????????'}
                    </InputLabel>
                    <Controller
                        as={
                            <Select >
                                <MenuItem value="????????????"><em>????????????</em></MenuItem>
                                <MenuItem value='??????'>{'??????'}</MenuItem>
                                <MenuItem value='????????'>{'????????'}</MenuItem>
                            </Select>
                        }
                        name="typeBuilding"
                        key={'typeBuilding' + props.data.typeBuilding}
                        //defaultValue={props.data.roof}
                        control={control}
                        labelId='typeBuilding'
                    />
                </FormControl>

                <FormControl error={Boolean(errors.material)}>
                    <InputLabel id="material">
                        {'????????????????'}
                    </InputLabel>
                    <Controller
                        as={
                            <Select>
                                <MenuItem value="????????????"><em>????????????</em></MenuItem>
                                <MenuItem value='????????????'>{'????????????'}</MenuItem>
                                <MenuItem value='??????????'>{'??????????'}</MenuItem>
                                <MenuItem value='????????????'>{'????????????'}</MenuItem>
                                <MenuItem value='??????????'>{'??????????'}</MenuItem>
                            </Select>
                        }
                        name="material"
                        key={'material' + props.data.material?.name}
                        control={control}
                        //rules={{ required: "this is required" }}
                        labelId='material'
                    //defaultValue={props.data.material.name || ''}
                    />
                    <FormHelperText>
                        {errors.material && '??????????????????????.'}
                    </FormHelperText>
                </FormControl>

                <FormControl>
                    <FormHelperText>??????????????????</FormHelperText>
                    <Controller
                        name="visible"
                        key={"visible" + props.data.visible}
                        control={control}
                        render={(props) => (
                            <Switch
                                onChange={(e) => props.onChange(e.target.checked)}
                                checked={props.value}
                                color="primary"
                            />
                        )}
                    />

                </FormControl>

                <Box className={classes.buttons}>
                    <Button
                        variant="contained"
                        disabled={(Object.entries(formState.dirtyFields).length < 1)}
                        //disabled={!formState.isDirty}
                        color="primary"
                        onClick={handleSubmit(onSubmit)}>
                        {'??????????????????'}
                    </Button>
                    <Button
                        variant="contained"
                        //disabled={!formState.isDirty}
                        disabled={(Object.entries(formState.dirtyFields).length < 1)}
                        onClick={(e) => {
                            //reset(e.target.value);
                            reset(defaultValues)
                        }}>
                        {"????????????"}
                    </Button>
                </Box>
            </form>
        </fieldset >
    )
}


export default connect(
    null,
    { editMainAtributes }
)(MainAtributes)
