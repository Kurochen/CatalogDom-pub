import { Card, CardActionArea, CardMedia } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 250
    },
    cover: {
        paddingTop: '56.25%', // 16:9
    },
}));

const ImageCard = (props) => {
    const classes = useStyles();
    return (
        <div>
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.cover}
                        image='https://unsplash.it/200/200'
                        title={props.title}
                        onClick={props.onClick}
                    >

                    </CardMedia>
                </CardActionArea>
            </Card>
        </div >
    )
};

export default ImageCard;

