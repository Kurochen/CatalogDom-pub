import { withStyles } from '@material-ui/core/styles';
import LoopIcon from '@material-ui/icons/Loop';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import Tooltip from '@material-ui/core/Tooltip';
import { updateStatusHelp } from '../helps/helpsText';

const HtmlTooltip2 = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

const UpdateStatus = (props) => {
    return (

        <HtmlTooltip2 title={props.text} >
            <span>
                <DesktopWindowsIcon />
                <LoopIcon />
            </span>
        </HtmlTooltip2>

    )
}

export default UpdateStatus