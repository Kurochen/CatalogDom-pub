import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import PayNextQiwi from "./PayNextQiwi";


//const cards = [1, 2, 3]

const useStyles = makeStyles({
    root: {
        minWidth: 250,
    },
});

const Pay = (props) => {
    const classes = useStyles();
    const [payArr, setPayArr] = useState([])
    const [statePayView, setStatePayView] = useState({
        view: false,
        index: 5
    })

    useEffect(() => {
        if (props.data.pays !== undefined) {
            let temp = Object.entries(props.data.pays)
            setPayArr(temp)
        }
    }, [props.data.pays])

    // разворачивает карточку с соотвтетсвующим идексом
    const handleClick = (index) => {
        setStatePayView({
            view: !statePayView.view,
            index: index
        })
    }

    return (
        <>
            {statePayView.view ?
                <PayNextQiwi dataHouse={props.data} idHouse={props.idHouse} data={payArr[statePayView.index]} handleClick={handleClick} /> :
                <>
                    {payArr.map((pay, index) => {
                        if (pay[1].visible && pay[1].price)
                            return (
                                <Grid item xs={12} key={index}>
                                    <Card className={classes.root}>
                                        <CardContent>
                                            <Typography variant="subtitle1" component="h2">
                                                {pay[1].title}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" style={{ whiteSpace: 'pre-line' }} >
                                                {pay[1].description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions >
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<ShoppingCartIcon />}
                                                onClick={() => handleClick(index)}
                                            >
                                                {pay[1].price && `${pay[1].price.toLocaleString()} руб`}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )
                    })}
                </>
            }
        </>
    );
}

export default Pay