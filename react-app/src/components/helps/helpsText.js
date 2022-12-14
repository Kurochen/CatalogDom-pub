//em - наклон
//b - жир
//u - подчеркивание
import { Typography } from "@material-ui/core"


export const example =
    <>
        <Typography color="inherit">Tooltip with HTML</Typography>
        <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
        {"It's very engaging. Right?"}
    </>

export const floorsHelp =
    <>
        <b>{"0.5"}</b> {' - неполный этаж. Например односкатная кровля или ломаная по типу как в вагончике/бытовке.'} <br />
        <b>{'1'}</b>{' - один этаж, плюс плоская или холодная чердачная кровля.'} <br />
        <b>{'1.5'}</b>{' - полутороэтажный дом/баня.'}
    </>

export const domTypeHelp =
    <>
        <b>{"0.5"}</b> {' - неполный этаж. Например односкатная кровля или ломаная по типу как в вагончике/бытовке.'} <br />
        <b>{'1'}</b>{' - один этаж, плюс плоская или холодная чердачная кровля.'} <br />
        <b>{'1.5'}</b>{' - полутороэтажный дом/баня.'}
    </>

// export const updateStatusHelp =
//     <>
//         {'Обновление сайта. Не рекомендуется выполнять редактирование и покупать проеты.'}
//     </>

export const descriptionUrlHelp =
    <>
        {'Дополнительные сведения о проекте. Ссылка на сторонний облачный ресурс'}
    </>