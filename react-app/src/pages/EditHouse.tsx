import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { getHouseForEdit } from '../redux/actions/dataActions'
import { useParams } from "react-router-dom";
import MainAtributes from '../components/edithouse/MainAtributes';
import AnotherThumbs from '../components/edithouse/AnotherThumbs';
import EditMaterial from '../components/edithouse/edit_material/EditMaterial';
import { Backdrop, CircularProgress } from '@material-ui/core';
import PayAtributes from '../components/edithouse/PayAtributes';
import DeleteHouse from '../components/edithouse/DeleteHouse';
import EditHouseHelp from '../components/helps/EditHouseHelp';
import { RootState } from '../redux/store';

type UseParamsType = {
    idHouse: string
}

const mapStateToProps = (state: RootState) => ({
    data: state.data.house,
    privateData: state.userData.housePrivate
})

const mapDispatchToProps = {
    getHouseForEdit
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

interface Props extends PropsFromRedux {
    //idHouse: string   //Лишнее? ведь пропсы не приходят
}


const EditHouse = (props: Props) => {
    let { idHouse } = useParams<UseParamsType>();

    useEffect(() => {
        props.getHouseForEdit(idHouse)
    }, [idHouse])

    if (!props.data.userId) {
        return (
            <Backdrop open={true} >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }
    return (
        <>
            <MainAtributes idHouse={idHouse} data={props.data} />
            <EditMaterial idHouse={idHouse} data={props.data.material} changedAt={props.data.changedAt} />
            <AnotherThumbs idHouse={idHouse} images={props.data.images} />
            <PayAtributes
                idHouse={idHouse}
                data={props.data.pays}
                changedAt={props.data.changedAt}
                privateData={props.privateData.pays} />
            <EditHouseHelp />
            < DeleteHouse idHouse={idHouse} images={props.data.images} />
        </>
    )
}


export default connector(EditHouse)