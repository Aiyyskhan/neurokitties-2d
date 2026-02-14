import styles from './ThanksPanel.module.scss';

const ThanksPanel: React.FC = () => {
    return (
        <div className={styles["thanksPanel"]}>
            <h2 className={styles["thanksPanel__title"]}>Thank you!</h2>
            <ul>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        <a href="https://zvukipro.com/jivotnie/3991-zvuki-mjaukanja-kotenka.html" target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkText}>Expeliartus and zvukipro.com</span>
                        </a> - for the sound "meow"
                    </p>
                </li>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        <a href="https://freesound.org/people/ruby_the_genius/sounds/794576" target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkText}>ruby_the_genius and freesound.org</span>
                        </a> - for nature sounds "Spring forest birdsong - 2025.03 1"
                    </p>
                </li>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        <a href="https://kenney.nl" target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkText}>kenney.nl</span>
                        </a> - for the sounds of "UI Audio", "Game Icons" and "Cursor Pack" 
                    </p>
                </li>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        {/* <a href="" target="_blank" rel="noopener noreferrer"> */}
                            <strong><span className={styles.linkText}>Egor Mandarov</span></strong>
                        {/*</a>*/} - for the equipment and support
                    </p>
                </li>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        <a href="https://www.altanschool.com/kz" target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkText}>altanschool.com</span>
                        </a> - for all your support
                    </p>
                </li>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        <a href="https://www.aseprite.org" target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkText}>aseprite.org</span>
                        </a> - for a wonderful tool for creating Pixel Art
                    </p>
                </li>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        <a href="https://www.mapeditor.org" target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkText}>mapeditor.org</span>
                        </a> - for the wonderful map creation tool Tiled
                    </p>
                </li>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        <a href="https://www.metaplex.com" target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkText}>metaplex.com</span>
                        </a> - for a powerful library for creating tokens and NFTs
                    </p>
                </li>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        <a href="https://phaser.io" target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkText}>phaser.io</span>
                        </a> - for a wonderful game engine
                    </p>
                </li>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkText}>react.dev</span>
                        </a> - for a powerful library for creating user interfaces
                    </p>
                </li>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        <a href="https://www.riffusion.com/song/fd6ae4ba-614f-4730-92a1-8553a5c34915" target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkText}>riffusion.com</span>
                        </a> - for generating the music "Serenity_4"
                    </p>
                </li>
                <li>
                    <p className={styles["thanksPanel__description"]}>
                        <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkText}>chatgpt.com</span>
                        </a> - for invaluable advice and tireless help
                    </p>
                </li>
            </ul>
        </div>
    );
}

export default ThanksPanel;