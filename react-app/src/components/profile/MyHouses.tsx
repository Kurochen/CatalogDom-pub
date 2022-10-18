import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import HouseCard from '../HouseCard';
import { HousePublicType } from '../../util/types'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
        margin: `${theme.spacing(1)}px auto`,
    },
    gallery: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
    },
    newHouseBtn: {
        paddingTop: '15px',
    },
}))

type PropsType = {
    uid: string,
    houses: HousePublicType[]
}

const MyHouses = (props: PropsType) => {
    const classes = useStyles();

    let projects = ''
    if (props.houses) {
        if (Object.keys(props.houses).length > 0) {
            if (props.uid === props.houses[0].userId) {
                projects = "Мои проекты"
            } else {
                projects = "Проекты"
            }
        }
    }

    return (
        <Box className={classes.paper}>
            {props.houses &&
                <Grid container>
                    <Typography gutterBottom variant="h4" component="h2" color='primary'>
                        {projects}
                    </Typography>
                </Grid>}

            <Grid container spacing={4} className={classes.gallery}>
                {props.houses && props.houses.map((house: any) => (
                    <Grid item key={house.houseId} >
                        <HouseCard data={house} uid={props.uid} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default MyHouses

