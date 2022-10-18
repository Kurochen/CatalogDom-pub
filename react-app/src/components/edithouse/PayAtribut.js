import { connect } from 'react-redux';
import { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import {
    FormControl, Button, Box,
    TextField, FormHelperText, InputAdornment,
    Grid, Switch
} from '@material-ui/core';
import { editPayAtributes } from '../../redux/actions/dataActions'


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
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

const PayAtribut = (props) => {
    const classes = useStyles();
    const defaultValues = {
        title: props.data?.title || '',
        price: props.data?.price || '',
        description: props.data?.description || '',
        link: props.data?.link || '',
        visible: props.data?.visible || false
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

    const onSubmit = async (data, e) => {
        const dirtyData = {};
        Object.entries(formState.dirtyFields).forEach(dirtyField => {
            dirtyData[dirtyField[0]] = data[dirtyField[0]];
        })
        dirtyData.item = props.item
        dirtyData.houseId = props.idHouse
        props.editPayAtributes(dirtyData);
        //console.log("PayAtribut dirtyData => ", dirtyData)
        //reset(); // reset after form submit

    };

    useEffect(() => {
        reset(defaultValues)
    }, [props.changedAt])


    return (
        <Grid item lg={6} >
            <fieldset>
                <legend>Вариант {props.item} </legend>
                <form className={classes.root}  >
                    <TextField
                        label="Название"
                        name="title"
                        key={'title' + props.data?.title}
                        inputRef={register({ maxLength: 15 })}
                        error={errors.title}
                        helperText={
                            errors.title && 'Максимум 15 символов.'
                        }
                    />
                    <TextField
                        label="Стоимость"
                        name="price"
                        key={'price' + props.data?.price}
                        //type='number'
                        inputRef={register({ max: 35000, min: 1 })}
                        error={errors.price}
                        helperText={errors.price && 'min 1, max 35 000'}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">руб.</InputAdornment>,
                        }}
                    />
                    <TextField
                        label="Описание"
                        name="description"
                        fullWidth={true}
                        multiline={true}
                        key={'description' + props.data?.description}
                        inputRef={register({ maxLength: 400 })}
                        error={errors.description}
                        helperText={errors.description && 'max 400'}
                    />
                    <TextField
                        label="Ссылка"
                        name="link"
                        fullWidth={true}
                        key={'link' + props.data?.link}
                        inputRef={register({ maxLength: 400 })}
                        error={errors.link}
                        helperText={errors.link && 'max 400'}
                    />
                    <FormControl>
                        <FormHelperText>Видимость</FormHelperText>
                        <Controller
                            name="visible"
                            key={"visible" + props.data?.visible}
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
                            {'Сохранить'}
                        </Button>
                        <Button
                            variant="contained"
                            //disabled={!formState.isDirty}
                            disabled={(Object.entries(formState.dirtyFields).length < 1)}
                            onClick={(e) => {
                                reset(e.target.value);
                            }}>
                            {"Отмена"}
                        </Button>
                    </Box>
                </form>
            </fieldset>
        </Grid>

    )
}


export default connect(
    null,
    {
        editPayAtributes,
    }
)(PayAtribut)