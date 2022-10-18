import { connect } from 'react-redux';
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core"
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import NewHouseButton from '../profile/NewHouseButton';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import {
    useParams,
    Link
} from "react-router-dom";
import { setMobileOpenFalseAC } from '../../redux/actions/uiActions';


const SidebarContentProfile = (props) => {
    let { idUser } = useParams();

    return (
        <List>

            {(props.uid === idUser) && <ListItem
                button
                component={Link}
                to={'/profile/edit'}
                onClick={props.setMobileOpenFalseAC}
            >
                <ListItemIcon>
                    <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Редактировать" />
            </ListItem>}

            {(props.uid === idUser) && <ListItem
                component={NewHouseButton}
                onClick={props.setMobileOpenFalseAC}
            >
                <ListItemIcon>
                    <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Добавить проект" />
            </ListItem>}

            {(props.uid === idUser) && <ListItem
                button
                component={Link}
                to={'/profile/purchases'}
                onClick={props.setMobileOpenFalseAC}
            >
                <ListItemIcon>
                    <LocalMallOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Мои покупки" />
            </ListItem>}

        </List>
    )
}


const mapStateToProps = state => {
    return {
        uid: state.UI.uid,
    }
}

export default connect(
    mapStateToProps,
    {
        setMobileOpenFalseAC
    }
)(SidebarContentProfile)