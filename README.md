<h1> NeuroKitties 2D </h1>

![Version](https://img.shields.io/github/v/tag/Aiyyskhan/neurokitties-2d?label=version&color=849e0e&style=flat-square)
![License](https://img.shields.io/github/license/Aiyyskhan/neurokitties-2d?label=license&style=flat-square)
![TensorFlow.js](https://img.shields.io/badge/AI-TensorFlow.js-FF6F00?logo=tensorflow&logoColor=white&style=flat-square)
![Solana](https://img.shields.io/badge/blockchain-Solana-9945FF?logo=solana&logoColor=white&style=flat-square)
![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=white&style=flat-square)
![Phaser](https://img.shields.io/badge/game%20engine-Phaser-2C8EBB?logo=phaser&logoColor=white&style=flat-square)


<h2>
🐱 Guide evolution. Select leaders. Mint as NFTs!
</h2>

<p>
    This is a life simulation game where you play as a neurofarmer. Your mission is to help a population of NeuroKitties, guided by tiny neural networks, evolve and navigate through a maze.
</p>
<p>
    Each NeuroKitty has its own neural network (brain), which evolves by transferring information from a selected leader to a recipient. If multiple leaders are selected, knowledge is shared between them; otherwise, it is passed to a NeuroKitty from the population.
</p>
<p>
    NeuroKitties can also be minted as NFTs on the Solana blockchain. By connecting a compatible wallet, you can mint a specific NeuroKitty as a unique on-chain asset, preserving its evolutionary progress. Once minted, the NFT is stored in your wallet and can be transferred or traded like any other digital asset on Solana.
</p>

<h2>✨ Play the Game</h2>

[![Play on itch.io](https://img.shields.io/badge/Play%20on-itch.io-FA5C5C?logo=itchdotio&logoColor=white&style=for-the-badge)](https://aiyyskhan.itch.io/neurokitties-2d)


<h2>🚀 How to Run from Source</h2>

<h3>📦 Prerequisites</h3>
<ul>
    <li><strong>Node.js</strong> 18+ (recommended: 20.x)</li>
    <li><strong>npm</strong> or <strong>pnpm</strong></li>
    <li>Modern web browser (Chrome / Firefox)</li>
</ul>

<h3>📥 Installation</h3>
<ol>
    <li>Clone the repository:
        <pre><code>git clone https://github.com/Aiyyskhan/neurokitties-2d.git
cd neuroKitties-2d</code></pre>
    </li>
    <li>Install dependencies:
        <pre><code>npm install</code></pre>
    </li>
</ol>

<h3>▶️ Run in Development Mode</h3>
<ol>
    <li>Start the dev server:
        <pre><code>npm run dev</code></pre>
    </li>
    <li>Open the game in your browser:
        <pre><code>http://localhost:5173</code></pre>
    </li>
</ol>

<h3>🧪 Notes</h3>
<ul>
    <li>Wallet features require a Solana wallet browser extension (e.g. Phantom).</li>
    <li>For NFT features, make sure the selected network matches your wallet network.</li>
    <li>Mainnet RPC endpoints may be rate-limited — consider using a custom RPC.</li>
</ul>

<h2>🎮 How to Play</h2>
<ul>
<li>
    <h3>🔐 Login</h3><br />
    Select a login method:
    <ul>
        <li><strong>Select Wallet</strong> — enables saving successful NeuroKitties as NFTs.</li>
        <li><strong>Without Wallet</strong> — play without blockchain features.</li>
    </ul>
</li><br />

<li>
    <h3>⚡ Quick Start</h3><br />
    <ol>
        <li>Press <strong>PLAY</strong> to start an episode.</li>
        <li>Select up to <strong>5 NeuroKitties</strong>.</li>
        <li>Pause → press <strong>EVO</strong> → adjust settings → press <strong>START</strong>.</li>
    </ol>
</li><br />

<li>
<h3>🖼️ NFT Panel (Wallet Login Only)</h3><br />

If you log in using a Solana wallet, an <strong>NFTs</strong> button appears in the menu.
Clicking it opens the NFT panel, where you can view your NeuroKitties stored in the wallet.<br /><br />

In this panel, you can:
<ul>
    <li>Select the Solana network (<strong>Mainnet</strong> or <strong>Devnet</strong>)</li>
    <li>Specify the RPC endpoint used to fetch NFTs</li>
    <li>Load your NFTs by clicking <strong>LOAD NFTs</strong></li>
</ul><br />

<strong>Important:</strong> the selected network in the application must match the network
currently selected in your Solana wallet. If the networks do not match, NFT loading or other
blockchain operations may fail.<br /><br />

<strong>Note:</strong> the default public Mainnet RPC endpoint may have usage limits.
If you experience loading issues, consider using an alternative RPC provider.
</li><br />


<li>
    <h3>▶️ Start the Game</h3><br />
    Press <strong>PLAY</strong> to begin an episode.
</li><br />

<li>
    <h3>🖥️ Game Screen &amp; HUD</h3><br />
    You will see a maze with NeuroKitties and a HUD panel at the top:
    <ul>
    <li>
        Left:
        <ul>
        <li><strong>GENERATION</strong> — the current generation of the NeuroKitties population</li>
        <li><strong>CHAMPIONS</strong> — the number of NeuroKitties that reached the finish</li>
        </ul>
    </li>
    <li>Center: <strong>SELECTED</strong> — IDs of currently selected NeuroKitties</li>
    <li>Right: <strong>PAUSE</strong>, <strong>MANUAL</strong> and <strong>EXIT</strong> buttons</li>
    </ul>
</li><br />

<li>
    <h3>🕹️ Camera Control</h3><br />
    Use the <strong>arrow keys</strong> to move the viewport.
</li><br />

<li>
    <h3>🐾 Selecting NeuroKitties</h3><br />
    <ul>
    <li><strong>Left-click</strong> a NeuroKitty to select it</li>
    <li><strong>Right-click</strong> to remove it from selection</li>
    <li>You can select up to <strong>5 NeuroKitties</strong> at once</li>
    </ul>
</li><br />

<li>
    <h3>⏸️ Pause &amp; Evolution Mode</h3><br />
    Press <strong>PAUSE</strong>. If at least one NeuroKitty is selected, the <strong>EVO</strong> button
    appears on the HUD, to the left of <strong>START</strong>.
</li><br />

<li>
    <h3>⚙️🧬 Evolution Settings</h3><br />
    Press <strong>EVO</strong> to open the evolution panel. Here you can adjust:
    <ul>
    <li><strong>Mutation probability</strong> — how often the NeuroKitty’s brain mutates</li>
    <li><strong>Mutation level</strong> — how strong those mutations are</li>
    <li><strong>Leader brain influence probability</strong> — chance of inheriting traits from the selected leader</li>
    <li><strong>Leader brain fraction</strong> — how much of the leader’s brain is transferred</li>
    </ul>
    Higher values increase diversity and risk; lower values favor stability.
</li><br />

<li>
    <h3>🧠 Learning Over Episodes</h3><br />
    Episode by episode, NeuroKitties learn to navigate the maze more effectively.
    Some episodes may perform worse due to mutations — this is expected. Stay patient and keep evolving.
</li><br />

<li>
    <h3>💾 Saving NeuroKitties as NFTs</h3><br />
    If you are logged in with a Solana wallet,
    an <strong>NFT</strong> button appears on the HUD while the game is paused.
    Use it to save selected NeuroKitties as NFTs.
</li><br />

<li>
    <h3>🚪 Exit</h3><br />
    Press <strong>EXIT</strong> to quit the game.
</li><br />
</ul>
<p>
    Enjoy the game!
</p>