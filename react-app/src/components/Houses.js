
import { Grid, makeStyles } from '@material-ui/core';
import HouseCard from '../components/HouseCard';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
        margin: `${theme.spacing(1)}px auto`,
    },
    gallery: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
    },
    newHouseBtn: {
        paddingTop: '15px',
    },
}))


function Houses(props) {
    const classes = useStyles();
    return (
        <Grid container spacing={4} className={classes.gallery}>
            {props.data && props.data.map((house) => (
                <Grid item key={house.houseId} className={classes.card}>
                    <HouseCard data={house} uid={props.uid} />
                </Grid>
            ))}
        </Grid>
    )
}

export default Houses

