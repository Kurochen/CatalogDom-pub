import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { addNewHouseAC } from '../../redux/actions/userDataActions'
import { Button, ListItem, ListItemIcon, ListItemText, } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';



function NewHouseButton(props) {
    const [open, setOpen] = React.useState(false);
    const textInput = useRef(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEnter = () => {
        props.addNewHouseAC(textInput.current.value, props.uid)
        setOpen(false);
    };

    return (
        <div>
            <ListItem button onClick={handleClickOpen}>
                <ListItemIcon>
                    <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Добавить проект" />
            </ListItem>

            {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                {'Добавить'}
            </Button> */}
            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Добавить проект</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Kороткое название для проекта
                    </DialogContentText>
                    <TextField
                        autoFocus
                        inputRef={textInput}
                        margin="dense"
                        id="name"
                        label="Название"
                        fullWidth
                        helperText='14 max'
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {'Отмена'}
                    </Button>
                    <Button onClick={handleEnter} color="primary">
                        {'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        uid: state.UI.uid
    }
}


export default connect(
    mapStateToProps,
    { addNewHouseAC }
)(NewHouseButton)