import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { createNft, fetchAllDigitalAssetWithTokenByOwner, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { Wallet, WalletContextState } from '@solana/wallet-adapter-react';
import { generateSigner, percentAmount, Umi, sol, publicKey } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { WebUploader } from "@irys/web-upload";
import { WebSolana } from "@irys/web-upload-solana";
import BaseWebIrys from '@irys/web-upload/esm/base';
import { SolanaCluster } from './types';
import * as config from '@/config';


export type MetadataAttributesType = {
    trait_type: string, 
    value: string,
}

export interface PartialMetadata {
    name: string;
    symbol: string;
    description: string;
    attributes: MetadataAttributesType[];
}

export interface FullMetadata extends PartialMetadata {
    image: string;
    properties: Record<string, unknown>;
    extensions: string;
}

// Для ссылок в explorer (если ты используешь ?cluster=devnet)
const explorerClusterParam: Record<SolanaCluster, string> = {
    mainnet: "mainnet-beta",
    devnet: "devnet",
};

const getIrysUploader = async (wallet: WalletContextState, cluster: SolanaCluster, solanaEndpoint: string) => {
    try {
        const irysUploader = cluster === "mainnet"
            ? await WebUploader(WebSolana).withProvider(wallet).withRpc(solanaEndpoint).mainnet()
            : await WebUploader(WebSolana).withProvider(wallet).withRpc(solanaEndpoint).devnet();

        return irysUploader; 
    } catch (error) {
        console.error("Error connecting to Irys:", error);
        throw new Error("Error connecting to Irys");
    }
};

async function initUmi(wallet: Wallet | null, solanaEndpoint: string): Promise<Umi> {
    if (!wallet?.adapter) {
        throw new Error('Problems with wallet adapter');
    }

    // Инициализация Umi
    const umi = createUmi(solanaEndpoint)

    umi.use(walletAdapterIdentity(wallet.adapter))
        .use(mplTokenMetadata())

    return umi;
}

export async function createNFT(
    wallet: WalletContextState,
    solanaEndpoint: string, 
    cluster: SolanaCluster,
    base64Image: string, 
    partMetadata: PartialMetadata,
    extensions: string
) {

    const umi = await initUmi(wallet.wallet, solanaEndpoint);

    try {
        const irysUploader = await getIrysUploader(wallet, cluster, solanaEndpoint);
        console.log(`Connected to Irys from ${irysUploader.address}`);

        const imageUri = await uploadImage(irysUploader, base64Image, partMetadata.name);

        const properties = {
            files: [{ uri: imageUri, type: "image/png" }],
            category: "image",
        }
        const metadata: FullMetadata = { 
            ...partMetadata, 
            image: imageUri, 
            properties: properties, 
            extensions: extensions 
        };
        const metadataUri = await uploadMetadata(irysUploader, metadata);

        await mint(umi, metadataUri, metadata.name, metadata.symbol, cluster);
    } catch (error) {
        console.log("Error connecting to Irys");
    }
}

async function uploadImage(irysUploader: BaseWebIrys, base64Image: string, kitty_name: string): Promise<string> {
    try {
        // Support environments with and without Node Buffer (browser)
        const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
        let imageBytes: Uint8Array;

        const globalBuffer = (globalThis as unknown as { Buffer?: { from?: (s: string, enc?: string) => Uint8Array } }).Buffer;
        if (globalBuffer && typeof globalBuffer.from === 'function') {
            imageBytes = globalBuffer.from(base64Data, 'base64');
        } else {
            // Fallback for browsers: use atob -> Uint8Array
            const binary = atob(base64Data);
            const len = binary.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
            imageBytes = bytes;
        }

        const safeBytes = new Uint8Array(imageBytes);
        const imageFile = new File([safeBytes], `${kitty_name}.png`, { type: 'image/png' });
        const size = imageFile.size;
        const price = await irysUploader.getPrice(size);
        console.log(`Uploading ${size} bytes costs ${irysUploader.utils.fromAtomic(price)}`); // ${token}`);
        await irysUploader.fund(price);

        const response = await irysUploader.uploadFile(imageFile);

        const imageUri = `${config.SOLANA.IRYS}/${response.id}`;

        console.log(`Image uploaded, URI: ${imageUri}`);
        return imageUri;
    } catch (err) {
        if (err instanceof Error) throw err;
        throw new Error(String(err));
    }
}

async function uploadMetadata(irysUploader: BaseWebIrys, metadata: FullMetadata, ): Promise<string> {
    try {
        console.log('Uploading metadata...');

        const json = JSON.stringify(metadata);
        const bytes = new TextEncoder().encode(json); // UTF-8 bytes
        const size = bytes.byteLength;

        const tags = [{ name: "Content-Type", value: "application/json" }];

        const price = await irysUploader.getPrice(size);
        console.log(`Uploading ${size} bytes costs ${irysUploader.utils.fromAtomic(price)}`); // ${token}`);
        await irysUploader.fund(price);

        const response = await irysUploader.upload(json, { tags });

        const metadataUri = `${config.SOLANA.IRYS}/${response.id}`;

        console.log(`Metadata uploaded, URI: ${metadataUri}`);
        return metadataUri;     
    } catch (err) {
        if (err instanceof Error) throw err;
        throw new Error(String(err));
    }
}

async function mint(
    umi: Umi, 
    metadataUri: string, 
    kitty_name: string, 
    kitty_symbol: string,
    cluster: SolanaCluster
) {
    try {
        const nftSigner = generateSigner(umi);

        const tx = await createNft(umi, {
            mint: nftSigner,
            name: kitty_name,
            symbol: kitty_symbol,
            uri: metadataUri,
            sellerFeeBasisPoints: percentAmount(5.5),
        }).sendAndConfirm(umi)

        const signature = base58.deserialize(tx.signature)[0];
        const clusterParam = explorerClusterParam[cluster];

        console.log("\nNFT Created")
        console.log("View Transaction on Solana Explorer");
        console.log(`${config.SOLANA.EXPLORER}/tx/${signature}?cluster=${clusterParam}`);
        console.log("\n");
        console.log("View NFT on Metaplex Explorer");
        console.log(`${config.SOLANA.EXPLORER}/address/${nftSigner.publicKey}?cluster=${clusterParam}`);
    } catch (err) {
        if (err instanceof Error) throw err;
        throw new Error(String(err));
    }
}

export async function getNFTs(
    wallet: WalletContextState, 
    solanaEndpoint: string,
    // cluster: SolanaCluster
): Promise<FullMetadata[] | null | undefined> {
    const umi = await initUmi(wallet.wallet, solanaEndpoint); //, cluster);

    try {    
        console.log("Получение списка NFT...");
        const assets = await fetchAllDigitalAssetWithTokenByOwner(umi, umi.identity.publicKey);

        const neuroKittyNFTs = await Promise.all(
            assets.map(async (nft) => {
                try {
                    const resp = await fetch(nft.metadata.uri);
                    if (!resp.ok) {
                        // throw new Error(`Ошибка HTTP при запросе metadata: ${resp.status}`);
                        console.error(`Ошибка HTTP при запросе metadata: ${resp.status}`);                        
                        return null;
                    }
                    const metadata: FullMetadata = await resp.json();
                    if (
                            metadata.name.startsWith("NeuroKitty") &&
                            metadata.attributes.some(attr => attr.trait_type === "game" && attr.value === "NeuroKitties") &&
                            metadata.attributes.some(attr => attr.trait_type === "version" && attr.value === config.GAME_VERSION)
                    ) {
                        return {
                            name: metadata.name,
                            symbol: metadata.symbol || "",
                            description: metadata.description || "No description available",
                            attributes: metadata.attributes || [],
                            properties: metadata.properties || {},
                            extensions: metadata.extensions,
                            image: metadata.image,
                        };
                    }
                } catch (err) {
                    console.error("Failed to fetch metadata for:", nft.metadata.uri, err);
                    return null;
                }
            })
        );
        return neuroKittyNFTs.filter(Boolean) as FullMetadata[];
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

export async function sendDonation(
    wallet: WalletContextState, 
    solanaEndpoint: string,
    cluster: SolanaCluster, 
    recipientAddr: string, 
    amount: number
) {
    const umi = await initUmi(wallet.wallet, solanaEndpoint);

    const donationAddress = publicKey(recipientAddr);
    const donationAmount = sol(amount); // Convert to lamports (1 SOL = 1,000,000,000 lamports)

    try {
        const tx = await transferSol(umi, {
            source: umi.identity,
            destination: donationAddress,
            amount: donationAmount,
        }).sendAndConfirm(umi);
        const signature = base58.deserialize(tx.signature)[0];
        const clusterParam = explorerClusterParam[cluster];

        console.log("Donation sent successfully!");
        console.log("View Transaction on Solana Explorer");
        console.log(`${config.SOLANA.EXPLORER}/tx/${signature}?cluster=${clusterParam}`);
    } catch (error) {
        console.error("Error sending donation:", error);
    }
}

// async function umiTest(umi: Umi) {
//     const endpoint = umi.rpc.getEndpoint();
//     const cluster = umi.rpc.getCluster();
    
//     console.log("Endpoint: " + endpoint);
//     console.log("Cluster: " + cluster);
//     console.log("umi pubkey: " + umi.identity.publicKey);
    
//     const balance = await umi.rpc.getBalance(umi.identity.publicKey);
//     console.log(`Balance: ${JSON.stringify(balance, (_, value) => typeof value === "bigint" ? Number(value) : value)}`);
// }

// async function airdrop(umi: Umi) {
//     // This will airdrop SOL on devnet only for testing.
//     await umi.rpc.airdrop(umi.identity.publicKey, sol(1.5));
// }
