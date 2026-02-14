import { FC, use } from "react";
import { SelectedKittiesContext } from "@/context/GameContext";

const SelectedInfo: FC = () => {
    const selectedKittiesContext = use(SelectedKittiesContext);
    const selectedKitties = selectedKittiesContext?.selectedKitties;
    const selectedKittiesId = selectedKitties?.map( k => k.id );

    return (
        <span>SELECTED: {`[${selectedKittiesId!.join(', ')}]`}</span>
    )
}

export default SelectedInfo;