import { Backdrop, CircularProgress, Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from "react-router-dom";
import { getHouseIdDB } from '../redux/actions/dataActions'
import Specifications from "../components/view_house/Specifications";
import Pay from "../components/view_house/Pay";

import ImageThumbs from "../components/view_house/ImageThumbs";
import ImageFirst from "../components/view_house/ImageFirst";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
//import firebaseApp from '../../src/util/firebaseApp'

//import { getAnalytics, logEvent } from "firebase/analytics";
import { RootState } from "../redux/store";
import { ImageType } from "../util/types";
//import ym from 'react-yandex-metrika';
//const analytics = getAnalytics(firebaseApp);


//For LightBox
const customStyles = {
    overlay: {
        zIndex: 1500,
    }
};

const useStyles = makeStyles((theme) => ({
    container: {
        float: "left",
    },
    gallery: {
        display: 'grid',
        [theme.breakpoints.up('md')]: {
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        },
        gridGap: theme.spacing(1),
    },
    description: {
        whiteSpace: 'pre-line'
    }
}))

type UseParamsType = {
    idHouse: string
}

const mapStateToProps = (state: RootState) => ({
    data: state.data.house,
    //payView: state.UI.payView
})

const mapDispatchToProps = {
    getHouseIdDB
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
interface Props extends PropsFromRedux {
    //idHouse: string //Лишнее? ведь пропсы не приходят
}

const ViewHouse = (props: Props) => {
    const classes = useStyles();
    let { idHouse } = useParams<UseParamsType>();

    //     ===============  LightBox  ===============
    const [photoIndex, setPhotoIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const handleClickImage = (index: number) => {
        setIsOpen(true);
        setPhotoIndex(index)
    }

    const [imgArr, setImgArr] = useState<ImageType[]>()

    useEffect(() => {
        if (props.data.images !== undefined) {
            let temp = Object.values(props.data.images)

            if (props.data.images[1] === undefined) {
                temp.unshift({})
            }
            setImgArr(temp)
        }
    }, [props.data.images])
    //    ================  LightBox end   ===========

    useEffect(() => {
        props.getHouseIdDB(idHouse)
    }, [idHouse])

    // useEffect(() => {
    //     logEvent(analytics, "page_view", {
    //         page_path: `viewhouse/${idHouse}`,
    //         page_title: props.data.name,
    //     });

    //     ym('hit', `viewhouse/${idHouse}`, {
    //         title: props.data.name,
    //     });
    // }, [idHouse])


    if (!props.data.userId) {
        return (
            <Backdrop open={true} >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Container className={classes.container}>
            <Grid container>
                <Typography gutterBottom variant="h4" component="h2" color='primary'>
                    {props.data.name}
                </Typography>
            </Grid>
            <Grid container spacing={2}>

                <Grid item container spacing={2} md={6} alignContent="flex-start">
                    <Grid item container>
                        <ImageFirst data={props.data.images} click={handleClickImage} />
                    </Grid>
                    <Grid item container className={classes.gallery}>
                        <ImageThumbs data={props.data} click={handleClickImage} />
                    </Grid>
                    <Grid item className={classes.description}>
                        <Typography gutterBottom variant="body2" component="p" >
                            {props.data.description}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid item container spacing={2} md={6} alignContent="flex-start">
                    <Grid item container spacing={2}>
                        <Specifications data={props.data} />
                    </Grid>
                    <Grid item container spacing={2}>
                        <Pay idHouse={idHouse} data={props.data} />
                    </Grid>
                </Grid>

            </Grid>

            {isOpen && (
                <Lightbox
                    mainSrc={imgArr![photoIndex]!.urlBig!}
                    nextSrc={imgArr![(photoIndex + 1) % imgArr!.length].urlBig}
                    prevSrc={imgArr![(photoIndex + imgArr!.length - 1) % imgArr!.length].urlBig}
                    onCloseRequest={() => setIsOpen(false)}
                    onMovePrevRequest={() => {
                        setPhotoIndex((photoIndex + imgArr!.length - 1) % imgArr!.length)
                    }}
                    onMoveNextRequest={() => {
                        setPhotoIndex((photoIndex + 1) % imgArr!.length)
                    }}
                    reactModalStyle={customStyles}
                />

            )}
        </Container>
    )
}

export default connector(ViewHouse)