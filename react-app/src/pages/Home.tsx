import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { getHouseAll } from '../redux/actions/dataActions';
import { makeStyles, Typography, Grid } from '@material-ui/core';
import Houses from '../components/Houses'
import Pagination from '../components/Pagination'
import { RootState } from '../redux/store';

const useStyles = makeStyles((theme) => ({
    typography: {
        paddingTop: theme.spacing(4)
    }
}))

const mapStateToProps = (state: RootState) => {
    return {
        pagination: state.data.pagination,
        houses: state.data.houses,
        filter: state.UI.filter,
        uid: state.UI.uid
    }
}

const mapDispatchToProps = {
    getHouseAll
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

interface Props extends PropsFromRedux { }

function Home(props: Props) {
    const classes = useStyles();

    useEffect(() => {
        props.getHouseAll(null, props.pagination.page)
    }, [props.filter])

    return (
        <>
            <Houses data={props.houses} uid={props.uid} />

            {(props.pagination.count === 0) &&
                <Grid container className={classes.typography}>
                    <Typography variant="body1" component="h3">
                        {"Объектов не нанйдено"}
                    </Typography>
                </Grid>}
            <Pagination
                onChange={props.getHouseAll}
                count={props.pagination.count}
                page={props.pagination.page}
            />
        </>
    )
}



export default connector(Home)

