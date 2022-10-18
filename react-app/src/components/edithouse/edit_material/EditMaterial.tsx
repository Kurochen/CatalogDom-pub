import Beton from "./Beton";
import Derevo from "./Derevo";
import Kirpich from "./Kirpich";
import Bloki from "./Bloki";
import Drugoe from "./Drugoe";
import { HousePublicType } from "../../../util/types";

type PropsType = {
    idHouse: string,
    data: HousePublicType["material"],
    changedAt: any
}

const EditMaterial = (props: PropsType) => {

    let renderSwitch = (argument: string | undefined) => {
        switch (argument) {
            case 'Кирпич':
                return <Kirpich idHouse={props.idHouse} data={props.data} changedAt={props.changedAt} />;
            case 'Дерево':
                return <Derevo idHouse={props.idHouse} data={props.data} changedAt={props.changedAt} />;
            case 'Бетон':
                return <Beton idHouse={props.idHouse} data={props.data} changedAt={props.changedAt} />;
            case 'Блоки':
                return <Bloki idHouse={props.idHouse} data={props.data} changedAt={props.changedAt} />;
            case 'Другое':
                return <Drugoe idHouse={props.idHouse} data={props.data} changedAt={props.changedAt} />;
            default:
                return 'Материал не указан';
        }
    }

    return (
        <fieldset>
            <legend>Характеристики для материала - {props.data?.name}</legend>
            {renderSwitch(props.data?.name)}
        </fieldset>
    )
};

export default EditMaterial;
