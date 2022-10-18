import React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import {
    getUserProfileDB,
    getHouseUserAll,
} from '../redux/actions/userDataActions';
import MyHouses from '../components/profile/MyHouses';
import ProfileCard from '../components/profile/ProfileCard';
import Pagination from '../components/Pagination';


const Profile = (props) => {
    let { idUser } = useParams();
    console.log(" Profile idUser =>", idUser)

    useEffect(() => {
        if (!props.uid) {
            console.log("return ")
            return
        }
        props.getUserProfileDB(idUser)
        props.getHouseUserAll(null, null, idUser)
        console.log("%c useEffect", 'color: white; background-color: #95B46A', "props.pagination.reset => ", props.pagination.reset)
    }, [props.pagination.reset, idUser, props.uid])  //TODO too many if else

    const handlePageChange = (event, page) => {
        props.getHouseUserAll(event, page, idUser)
    }
    return (
        <>
            <ProfileCard userData={props.userData} />
            {props.houses && <MyHouses houses={props.houses} uid={props.uid} />}
            {props.houses && <Pagination
                onChange={handlePageChange}
                count={props.pagination.count}
                page={props.pagination.page}
            />}
        </>
    )
}

const mapStateToProps = state => {
    return {
        userData: state.userData.user,
        houses: state.userData.houses,
        uid: state.UI.uid,
        pagination: state.userData.pagination,
    }
}

export default connect(
    mapStateToProps,
    {
        getHouseUserAll,
        getUserProfileDB,
    }
)(Profile)