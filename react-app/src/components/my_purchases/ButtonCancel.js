import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { deleteBillQiwiPay } from '../../redux/actions/uiActions';

function ButtonCancel(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        props.deleteBillQiwiPay(resData)
        setOpen(false);
    };

    let textHeader
    let textBody
    console.log('ButtonCancel props.buy.status=>', props.buy.status.value)
    if (props.buy.status.value === 'PAID') {
        textHeader = 'Удалить проект?'
        textBody = ''
    } else {
        textHeader = 'Удалить выставленный счет?'
        textBody = 'Если счет был оплачен, после удаления счета, получить ссылку на проект станет невозможным.'
    }

    const resData = { billId: props.buy.billId }

    return (
        <>
            <Button color="secondary" onClick={handleClickOpen}>
                {"Удалить"}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{textHeader}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {textBody}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        {"Отмена"}
                    </Button>
                    <Button onClick={handleDelete} color="secondary" >
                        {"Удалить"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default connect(
    null,
    {
        deleteBillQiwiPay
    }
)(ButtonCancel)