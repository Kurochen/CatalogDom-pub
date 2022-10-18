import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import MyPurchase from '../components/my_purchases/MyPurchase';
import { getMyPurchases } from '../redux/actions/uiActions';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },

}));


const MyPurchases = (props) => {
    const classes = useStyles();

    const [expanded, setExpanded] = useState(false);
    const handleChangeAccordion = (data) => (event, isExpanded) => {
        setExpanded(isExpanded ? data : false);
    };

    useEffect(() => {
        props.getMyPurchases(props.uid)
    }, [props.uid])

    return (
        <div>
            {props.purchases && props.purchases.map((buy, index) => (
                <MyPurchase
                    changedAt={buy.changedAt}
                    key={index}
                    buy={buy.qiwiData}
                    index={index}
                    handleChangeAccordion={handleChangeAccordion}
                    expanded={expanded}
                />
            ))}
        </div>
    )
}


const mapStateToProps = state => {
    return {
        purchases: state.UI.myPurchases,
        uid: state.UI.uid
    }
}

export default connect(
    mapStateToProps,
    {
        getMyPurchases,
    }
)(MyPurchases)