import { useState } from "react"
import { connect } from 'react-redux';
import { setFilter, resetFilter } from '../../redux/actions/uiActions'
import { resetSnapshotPagination } from '../../redux/actions/dataActions'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Checkbox, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography, FormGroup, } from "@material-ui/core";
import { concreteType, blockType, woodType } from '../../util/constants'
import HelpsButton from "../helps/HelpsButton";
import { floorsHelp } from "../helps/helpsText";



const useStyles = makeStyles((theme) => ({
    button: {
        margin: '10px 10px 10px 10px'
    },
    fieldset: {
        border: 'none',
        marginTop: theme.spacing(2),
    },
    input_1: {
        marginRight: '8px',
        width: 'calc(50% - 4px)'
    },
    input_2: {
        width: 'calc(50% - 4px)'
    },
    accordeonBody: {
        flexDirection: 'column',
        padding: 0
    },
    head: {
        textAlign: 'center'
    },
    heading: {
        //fontSize: theme.typography.pxToRem(15),
        //fontWeight: theme.typography.fontWeightRegular,
    },
    accordeonSummary: {

    },
    accordion: {
        backgroundColor: '#fafafa'
    }

}));


const floors = [
    { name: '0.5', label: '0.5' },
    { name: '1', label: '1' },
    { name: '1.5', label: '1.5' },
    { name: '2', label: '2' },
    { name: '2.5', label: '2.5' },
    { name: '3', label: '3' },
]

const typeBuilding = [
    { name: 'Дом', label: 'Дом' },
    { name: 'Баня', label: 'Баня' },
]

const material = [
    { name: 'Кирпич', label: 'Кирпич', },
    { name: 'Блоки', label: 'Блоки', },
    { name: 'Дерево', label: 'Дерево', },
    { name: 'Бетон', label: 'Бетон', },
    { name: 'material_Другое', label: 'Другое', },
]


const SidebarContentHome = (props) => {
    const classes = useStyles();
    const initialArea = {
        minArea: props.filter.minArea,
        maxArea: props.filter.maxArea
    }

    const [state, setState] = useState(initialArea)

    const handleClick = (event) => {
        props.resetSnapshotPagination();
        if (props.filter[event.target.name] !== event.target.value) {
            props.setFilter({ [event.target.name]: event.target.value })
        } else {
            props.setFilter({ [event.target.name]: false })
        }
    }

    const floorsClick = (event) => {
        props.resetSnapshotPagination();
        props.setFilter({ [event.target.name]: event.target.checked });
    }
    const onBlurArea = (event) => {
        props.resetSnapshotPagination();
        props.setFilter({ [event.target.name]: event.target.value });
    }
    const changeArea = (event) => {
        setState({ ...state, [event.target.name]: event.target.value })
    }
    const resetButtonHandle = () => {
        props.resetFilter();
        props.resetSnapshotPagination();
        setState({
            minArea: '',
            maxArea: ''
        })
    }

    const radioGroupTemplate = (legend, name, valueState, onClick, arr, helpsTitle) => {
        return (
            <fieldset className={classes.fieldset}>
                <HelpsButton title={helpsTitle}>
                    <legend>
                        <Typography variant="body" component="h3">
                            {legend}
                        </Typography>
                    </legend>
                    <RadioGroup aria-label="typeBuilding" name={name} value={valueState} onClick={onClick} >
                        <Grid container>
                            {arr.map((item) => (
                                <Grid item xs={6} key={item.name}>
                                    <FormControlLabel
                                        value={item.name}
                                        label={item.label}
                                        control={<Radio color="primary" />}
                                        checked={valueState === item.name}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </RadioGroup>
                </HelpsButton>
            </fieldset>
        )
    }

    return (<>

        {radioGroupTemplate('Тип строения', 'typeBuilding', props.filter.typeBuilding, handleClick, typeBuilding)}
        {radioGroupTemplate('Материал', 'material', props.filter.material, handleClick, material)}


        {props.filter.material === 'Бетон' &&
            radioGroupTemplate('Бетон', 'concreteType', props.filter.concreteType, handleClick, concreteType)}
        {props.filter.material === 'Блоки' &&
            radioGroupTemplate('Блоки', 'blockType', props.filter.blockType, handleClick, blockType)}
        {props.filter.material === 'Дерево' &&
            radioGroupTemplate('Дерево', 'woodType', props.filter.woodType, handleClick, woodType)}

        {/* ====== == Число этажей == ===== */}

        <fieldset className={classes.fieldset}>
            <HelpsButton title={floorsHelp}>
                <legend>
                    <Typography variant="body" component="h3">
                        {'Этажей'}
                    </Typography>
                </legend>

                <FormGroup>
                    <Grid container>
                        {floors.map((item) => (
                            <Grid item xs={6} key={item.name}>
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={props.filter[item.name]}
                                        onChange={floorsClick}
                                        name={item.label}
                                        color="primary" />}
                                    label={item.label}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </FormGroup>
            </HelpsButton>
        </fieldset>

        {/* ====== == Площадь == ===== */}

        <fieldset className={classes.fieldset}>
            <legend>
                <Typography variant="body" component="h3">
                    {'Площадь'}
                </Typography>
            </legend>
            <TextField className={classes.input_1}
                placeholder='min'
                name="minArea"
                value={state.minArea}
                variant="outlined"
                size="small"
                fullWidth={true}
                inputProps={{ onBlur: onBlurArea }}
                onChange={changeArea}
            />
            <TextField className={classes.input_2}
                placeholder='max'
                name="maxArea"
                value={state.maxArea}
                variant="outlined"
                size="small"
                fullWidth={true}
                inputProps={{ onBlur: onBlurArea }}
                onChange={changeArea}
            />
        </fieldset>

        <Grid container className={classes.buttons}>
            <Grid item container xs={12}>
                <Button
                    className={classes.button}
                    fullWidth='true'
                    variant="outlined"
                    onClick={resetButtonHandle}>
                    {"Сброс"}
                </Button>
            </Grid>
        </Grid>

    </>
    )
};

const mapStateToProps = state => {
    return {
        filter: state.UI.filter
    }
}

export default connect(
    mapStateToProps,
    {
        setFilter,
        resetFilter,
        resetSnapshotPagination
    }
)(SidebarContentHome)

