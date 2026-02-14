import style from './InfoPanel.module.scss';

interface InfoPanelProps {
    info: string | null;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ info }) => {
    return (
        <div className={style["infoPanel"]}>
            <p>{info}</p>
        </div>
    );
}

export default InfoPanel;