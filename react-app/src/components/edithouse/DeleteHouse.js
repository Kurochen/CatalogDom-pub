import { useState } from 'react';
import { connect } from 'react-redux'
import { deleteHouse } from '../../redux/actions/dataActions';
import { useHistory } from "react-router-dom";

import { Button, makeStyles } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';



const useStyles = makeStyles((theme) => ({
    del: {
        marginTop: theme.spacing(7)
    },
}))

const AnotherThumbs = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    let history = useHistory()

    const handleDelete = (event) => {
        let data = {}
        data.houseId = props.idHouse
        props.deleteHouse(data, history)
        setOpen(false);
    }

    const handleOpenModal = (event) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button onClick={handleOpenModal} variant='outlined' color="secondary" className={classes.del}>
                {'Удалить'}
            </Button>


            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    {'Удаление проекта'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {' Удалить полностью проект?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="default">
                        {'Отмена'}
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        {'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
};

export default connect(
    null,
    {
        deleteHouse
    }
)(AnotherThumbs);
