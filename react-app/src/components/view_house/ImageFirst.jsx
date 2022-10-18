import { CardActionArea, CardMedia, Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    img: {
        width: '100%',
        backgroundColor: '#dcdcdc',
        paddingTop: '56.25%', // 16:9
    },
}))

const ImageFirst = props => {
    const classes = useStyles();

    return (
        <CardActionArea>
            <Paper>
                <CardMedia
                    className={classes.img}
                    image={props.data[1]?.urlBig}
                    title={props.data[1]?.title}
                    onClick={props.data[1] && (() => props.click(0))}
                />
            </Paper>
        </CardActionArea>
    )
}

export default ImageFirst;
