import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import PaginationNC from "@material-ui/lab/Pagination";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            marginTop: theme.spacing(2),
            justifyContent: "center",
            display: 'flex'
        },
    },
}));

type PropsType = {
    onChange: (event: any, page: number) => void;
    count: number
    page: number
}

const Pagination = (props: PropsType) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <PaginationNC
                color="primary"
                variant="outlined"
                count={props.count}
                page={props.page}
                onChange={props.onChange} //Default arguments of Maretial-UI - (event, page)
            />
        </div>
    )
};

export default Pagination;
