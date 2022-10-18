import { connect } from 'react-redux';
//import { getMyPurchases } from '../redux/actions/uiActions';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import UpdateOutlinedIcon from '@material-ui/icons/UpdateOutlined';
import { green } from '@material-ui/core/colors';
import { AccordionActions, Box, Button } from '@material-ui/core';
import PurshaseTable from './PurshaseTable';
import ButtonCancel from './ButtonCancel'
import { checkBillQiwiPay } from '../../redux/actions/uiActions';


const useStyles = makeStyles((theme) => ({

    icon: {
        flexBasis: '10%',
        flexShrink: 0,
        maxWidth: theme.typography.pxToRem(40),
    },
    heading: {
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
    },
    main: {
        flexDirection: 'column'
    },
    table: {
        marginTop: theme.spacing(1)
    }
}));



const MyPurchase = (props) => {
    const classes = useStyles();
    const dataForAxios = {
        billId: props.buy.billId,
        sellerId: props.buy.customFields.sellerId
    }

    let button = false
    let icon = false
    if (props.buy.status.value === 'WAITING') {
        button = <>
            <Typography gutterBottom >
                {`Платеж поступил в обработку. Примерно через 1-2 минуты после оплаты, нажмите "Обновить", чтобы появилась ссылка на проект.`}
            </Typography>
            <Button variant="outlined" color="primary" startIcon={<UpdateOutlinedIcon />} onClick={() => props.checkBillQiwiPay(dataForAxios)} >
                {"Обновить"}
            </Button>
        </>
        icon = <HourglassEmptyOutlinedIcon color="primary" />
    }
    if (props.buy.status.value === 'PAID') {
        button = <Button variant="outlined" color="primary" startIcon={<CloudDownloadOutlinedIcon />} href={props.buy.customFields.linkProject} target="_blank">
            {"Скачать"}
        </Button>
        icon = <CheckOutlinedIcon style={{ color: green[500] }} />
    }
    if (props.buy.status.value === 'EXPIRED') {
        button = <Typography gutterBottom >
            {`Время жизни счета истекло.`}
        </Typography>
    }
    if (props.buy.status.value === 'REJECTED') {
        button = <Typography gutterBottom >
            {`Счет отклонен`}
        </Typography>
    }


    return (
        <Accordion expanded={props.expanded === props.index} onChange={props.handleChangeAccordion(props.index)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Box className={classes.icon}>{icon}</Box>
                <Typography className={classes.heading}>{props.buy.customFields.houseIdName}</Typography>

                <Typography className={classes.secondaryHeading}>{props.buy.customFields.payIdName}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.main}>
                {button}
                <Box className={classes.table}>
                    <PurshaseTable data={props.buy} changedAt={props.changedAt} />
                </Box>
            </AccordionDetails>
            <AccordionActions>
                <ButtonCancel buy={props.buy} />
            </AccordionActions>
        </Accordion>

    );
}

const mapStateToProps = state => {
    return {
        uid: state.UI.uid,
        purchases: state.UI.purchases
    }
}

export default connect(
    mapStateToProps,
    {
        checkBillQiwiPay,
    }
)(MyPurchase)