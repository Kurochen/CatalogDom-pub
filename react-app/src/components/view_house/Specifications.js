import { Grid, makeStyles } from "@material-ui/core"
import Link2 from '@material-ui/core/Link'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from "react-router-dom";
import OpenInNewOutlinedIcon from '@material-ui/icons/OpenInNewOutlined';

const useStyles = makeStyles((theme) => ({
    img: {
        width: '100%',
    },
    icon: {
        verticalAlign: "text-top"
    },
    table: {
        //width: '100%',
        //minWidth: 400,
        //maxWidth: 500,
    },
    // row: {
    //     '&:nth-of-type(odd)': {
    //         backgroundColor: theme.palette.action.hover,
    //     },
    // },
}))



const Specifications = (props) => {
    const classes = useStyles()

    function createData(name, value) {
        return { name, value }
    }

    const linkUserId =
        <Link2
            component={Link}
            to={`/profile/${props.data.userId}`} >
            {props.data.userEmail.split('@')[0]}
        </Link2>

    let descriptionURL = false
    if (props.data.descriptionURL) {
        descriptionURL =
            <Link2
                href={props.data.descriptionURL}
                target="_blank"
                rel="noopener" >
                {'Ссылка  '}
                <OpenInNewOutlinedIcon className={classes.icon} fontSize='inherit' />
            </Link2>
    }

    const rows = [
        createData('Площадь', `${props.data.area} m2`),
        createData('Габариты', `${props.data.width} x ${props.data.length}`),
        createData('Этажей', props.data.floors),
        createData('Тест', props.data.floorsxx),
        createData('Кровля', props.data.roof),
        createData('Фундамент', props.data.foundation),
        createData('Подробнее', descriptionURL),
        createData('Автор', linkUserId)
    ];

    const rowsMaterial = [
        createData('Материал', props.data.material.name),
        createData('Тип', props.data.material.woodType),
        createData('Тип бруса', props.data.material.brusType),
        createData('Высота бруса', props.data.material.brusHeight),
        createData('Ширина бруса', props.data.material.brusWidth),
        createData("Диаметр бревна", props.data.material.brevnoDiameter),
        createData("Объем сруба", props.data.material.brevnoVolime),
        createData("Тип блока", props.data.material.blockType),
        createData("Тип керамики", props.data.material.keramikaType),
        createData("Тип бетона", props.data.material.concreteType),
        createData("Ширина", props.data.material.widthMaterial),

    ]

    return (
        <>
            <Grid item xs>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="Харктеристики">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2}>Основные харктеристки</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                row.value && <TableRow key={row.name} className={classes.row}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell >{row.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="Харктеристики">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2}>Характеристики материала</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rowsMaterial.map((row) => (
                                row.value && <TableRow key={row.name} className={classes.row}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell >{row.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    )
};

export default Specifications;
