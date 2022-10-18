import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
        backgroundColor: 'gray'
    },
    cardContent: {
        flexGrow: 1,
    },
}));


const HouseCard = (props) => {
    const classes = useStyles();

    //   Ищем тип материала если есть

    let materialType = false
    let regexp = /woodType|concreteType|blockType/
    if (props.data.material) {
        Object.keys(props.data.material).forEach(key => {
            if (regexp.test(key)) {
                materialType = props.data.material[key]
            }
        });
    }
    // const handleClick = () => {
    //     console.log(props.data.userId)
    // }
    return (
        <Card className={classes.card}>
            <CardActionArea
                //onClick={handleClick}
                component={Link}
                to={`/viewhouse/${props.data.houseId}`}>
                <CardMedia
                    className={classes.cardMedia}
                    image={props.data.images?.[1]?.urlSmall}
                    title={props.data.images?.[1]?.title}
                />
            </CardActionArea>
            <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2" color='primary'>
                    {props.data.name}
                </Typography>
                <Typography variant="body2" component="p">
                    {props.data.area}м&#178;&#8195;
                    {props.data.length}&#215;{props.data.width}
                    &#8195;{materialType || props.data.material?.name}&#8195;
                    {props.data.pays?.[1]?.price && `${props.data.pays[1].price.toLocaleString()}\u00A0руб`}
                </Typography>
            </CardContent>
            {(props.uid === props.data.userId) &&
                <CardActions>
                    <Button
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/profile/edithouse/${props.data.houseId}`}
                    >
                        {"Редактировать"}
                    </Button>
                    {(!props.data.visible || !props.data.verifiedUser) && <VisibilityOffIcon color='disabled' />}
                </CardActions>}
        </Card>
    )
}

export default HouseCard