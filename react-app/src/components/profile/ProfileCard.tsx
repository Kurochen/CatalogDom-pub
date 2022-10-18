import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, SvgIcon } from '@material-ui/core';
import { logoVK, logoFH } from './svgIcons';
import { UsersPublicType } from '../../util/types'

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '900px',
        padding: theme.spacing(1),
    },
    name: {
        // flexBasis: '60%'
    },
    avatarLarge: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    },
    icons: {
        padding: 0,
        '& > *': {
            padding: 7,
        }
    },
    buttons: {
        padding: theme.spacing(2),
        justifyContent: 'flex-end',
    },
    description: {
        whiteSpace: 'pre-line'
    }
}));

function VkIcon() {
    return (
        <SvgIcon fontSize="medium" viewBox='0 0 192 192'>
            {logoVK}
        </SvgIcon>
    );
}

function FhIcon() {
    return (
        <SvgIcon fontSize="medium" viewBox='0 0 2250 2250' transform="rotate(90)">
            {logoFH}
        </SvgIcon>
    );
}

type PropsType = {
    userData: UsersPublicType,
}

const ProfileCard = (props: PropsType) => {
    const classes = useStyles();

    return (
        <Grid item container spacing={2} >
            {/* <Grid item >
                    <Avatar alt={name} src={photoUrl} className={classes.avatarLarge} />
                </Grid > */}
            <Grid item className={classes.name}>
                {props.userData.name &&
                    <Typography gutterBottom={true} variant="h4" component="h2" color='primary' >
                        {props.userData.name}
                    </Typography>}

                {props.userData.bio &&
                    <Typography className={classes.description} component='p'>
                        {props.userData.bio}
                    </Typography>}
                <Box className={classes.icons}>
                    {props.userData.linkVK &&
                        <IconButton href={props.userData.linkVK} aria-label="link vk" target='_blank' rel="noopener">
                            <VkIcon />
                        </IconButton>
                    }
                    {props.userData.linkFH &&
                        <IconButton href={props.userData.linkFH} aria-label="link fh" target='_blank' rel="noopener">
                            <FhIcon />
                        </IconButton>
                    }
                </Box>
            </Grid>
        </Grid>
    )
}

export default ProfileCard