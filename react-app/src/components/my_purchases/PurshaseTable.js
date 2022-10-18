import { withStyles } from "@material-ui/core"
import Link2 from '@material-ui/core/Link'

//import ImageThumbs from "./ImageThumbs"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from "react-router-dom";
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ru } from "date-fns/locale";


const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);


const PurshaseTable = (props) => {

    function createData(name, value) {
        return { name, value }
    }

    const linkSellerId =
        <Link2
            component={Link}
            to={`/profile/${props.data.customFields?.sellerId}`}
            target="_blank" >
            {props.data.customFields?.sellerId}
        </Link2>

    const linkPay =
        <Link2
            href={props.data.payUrl}
            target="_blank"  >
            {props.data.payUrl}
        </Link2>

    const dateFormat = (date) => {
        return `${format(new Date(date), 'H:mm MM/dd/yyyy')} (${formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru })})`
    }

    let changedAt
    if (props.changedAt._seconds) {  //Loosing TimesTammp if server response data
        changedAt = props.changedAt._seconds * 1000
    } else {
        changedAt = props.changedAt.toDate()
    }


    const rows = [
        createData('Счет выставлен', dateFormat(props.data.creationDateTime)),
        createData('Счет обновлен', dateFormat(changedAt)),
        createData('Счет истекает', dateFormat(props.data.expirationDateTime)),
        createData('ID платежа', props.data.billId),
        createData('Сумма платежа', `${props.data.amount.value.toLocaleString()} ${props.data.amount.currency}`),
        createData('ID продавца', linkSellerId),
        createData('Телефон продавца', props.data.customFields.sellerPhone),
        createData('Email продавца', props.data.customFields.sellerEmail),
        createData('Текущая ссылка', props.data.customFields.linkProject),
        createData('Снимок ссылки', props.data.customFields.linkProjectSnapshot),
        createData('URL оплаты', linkPay)
    ];


    return (
        <TableContainer >
            <Table size="small" aria-label="Харктеристики">
                <TableHead>
                    <TableRow>
                        <TableCell >Основные харктеристки</TableCell>
                        <TableCell >Данные</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        row.value && <StyledTableRow key={row.name} >
                            <TableCell component="th" scope="row" >
                                {row.name}
                            </TableCell>
                            <TableCell >{row.value}</TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
};

export default PurshaseTable;
