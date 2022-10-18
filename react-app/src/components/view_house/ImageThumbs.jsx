import {
    Card,
    CardActionArea,
    CardMedia,
    makeStyles,
    Paper,
} from "@material-ui/core";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
    media: {
        paddingTop: '56.25%', // 16:9
    }
}))


const ImageThumbs = (props) => {
    const classes = useStyles();

    const [imgArr, setImgArr] = useState([])

    useEffect(() => {
        if (props.data.images !== undefined) {
            let tempProps = { ...props.data.images }
            delete tempProps[1]
            let tempArr = Object.values(tempProps)
            // temp.shift(); //del first big image  ///
            setImgArr(tempArr)
            // console.log("image thumbs imgArr=>", props.data.images)
            //console.log("image thumbs imgArr=>", tempArr)
        }
    }, [props.data.images])

    return (
        <>
            {imgArr.map((img, index) => (
                <Paper key={img.urlSmall}>
                    <Card >
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image={img.urlSmall}
                                title={img.title}
                                onClick={() => {
                                    props.click(index + 1);
                                }}
                            />
                        </CardActionArea>
                    </Card>
                </Paper>
            ))}
        </>
    )
};

export default ImageThumbs;
