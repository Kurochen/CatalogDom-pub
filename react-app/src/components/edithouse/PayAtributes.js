import { Grid } from "@material-ui/core";
import PayAtribut from './PayAtribut'

const arr = [1, 2, 3]

const PayAtributes = (props) => {
    //console.log('payAtributes props =>', props.privateData)
    return (
        <fieldset>
            <legend>Стоимость и ссылки</legend>
            <Grid container spacing={1}>
                {arr.map((item) => (
                    <PayAtribut
                        key={item}
                        data={props.data?.[item]}
                        privateData={props.privateData?.[item]}
                        item={item}
                        changedAt={props.changedAt}
                        idHouse={props.idHouse} />
                ))}
            </Grid>
        </fieldset>
    )
};

export default PayAtributes;
