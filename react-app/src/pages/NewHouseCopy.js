import React, { useReducer } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FormControl, InputLabel, Select, MenuItem, Button, Box } from '@material-ui/core';

import { connect } from "react-redux";
import { addNewHouseAC } from '../redux/actions/dataActions'

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


const NewHouse = (props) => {
    const classes = useStyles();
    const [userInput, setUserInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            name: '',
            area: '',
            material: '',
        }
    );

    const handleChange = event => {
        const { name, value } = event.target;
        setUserInput({ [name]: value });
    }

    const handleClick = () => {
        props.addNewHouseAC(userInput);
        //console.log(userInput)
    }

    return (
        <>
            <fieldset>
                <legend>Основные сведения</legend>
                <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                        label="Название"
                        name="name"
                        fullWidth={true}
                        value={userInput.name}
                        onChange={handleChange}
                    />
                    <TextField
                        type="Number"
                        label="Площадь"
                        name="area"
                        value={userInput.area}
                        onChange={handleChange}
                    />
                    <FormControl>
                        <InputLabel>Материал</InputLabel>
                        <Select
                            name="material"
                            value={userInput.material}
                            onChange={handleChange}
                        >
                            <MenuItem value={'Кирпич'}>Кирпич</MenuItem>
                            <MenuItem value={'Дерево'}>Дерево</MenuItem>
                            <MenuItem value={'Газобетон'}>Газобетон</MenuItem>
                        </Select>
                    </FormControl>

                    <Box className={classes.buttons}>
                        <Button variant="contained" color="primary" onClick={handleClick}>
                            {'Сохранить'}
                        </Button>
                        <Button variant="contained" >
                            {"Отмена"}
                        </Button>
                    </Box>
                </form>
            </fieldset>
        </>
    )
}

export default connect(
    null,
    { addNewHouseAC }
)(NewHouse)