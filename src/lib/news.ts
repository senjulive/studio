export type NewsItem = {
    id: string;
    source: string;
    title: string;
    timeAgo: string;
    url: string;
    date: string;
    author: string;
    imageUrl?: string;
    content: string[];
};

export const allMockNews: NewsItem[] = [
    { 
        id: 'btc-surge-70k', 
        source: 'CryptoNews', 
        title: 'Bitcoin Surges Past $70,000 as Institutional Interest Grows', 
        timeAgo: '2h ago', 
        url: '#',
        date: 'July 15, 2024',
        author: 'Jane Doe',
        imageUrl: 'https://placehold.co/800x400.png',
        data-ai-hint: 'bitcoin graph',
        content: [
            "Bitcoin (BTC) has once again captured the attention of the financial world, surging past the $70,000 mark in a remarkable display of bullish momentum. The latest rally is largely attributed to a renewed wave of institutional interest, with several major investment firms announcing significant allocations to the leading cryptocurrency.",
            "Analysts point to the recent approval of several Bitcoin ETFs as a key catalyst, providing a regulated and accessible entry point for large-scale investors. This influx of capital has created a supply shock, driving prices to new all-time highs. The market sentiment is overwhelmingly positive, with many experts predicting further upside potential in the coming months."
        ]
    },
    { 
        id: 'eth-pectra-upgrade', 
        source: 'CoinDesk', 
        title: 'Ethereum\'s Next Upgrade "Pectra" Details Revealed', 
        timeAgo: '4h ago', 
        url: '#',
        date: 'July 15, 2024',
        author: 'John Smith',
        imageUrl: 'https://placehold.co/800x400.png',
        data-ai-hint: 'ethereum network',
        content: [
            "The Ethereum development community has unveiled the first official details of the network's next major upgrade, codenamed \"Pectra.\" The upgrade aims to introduce several key improvements, including enhanced scalability through Verkle trees, and a new feature called \"account abstraction,\" which will simplify wallet interactions and improve user experience.",
            "Developers are particularly excited about the potential of Pectra to lower gas fees and increase transaction throughput, addressing some of the network's most persistent challenges. The upgrade is expected to be rolled out in early 2025, following a series of rigorous testing phases."
        ]
    },
    { 
        id: 'sol-defi-airdrop', 
        source: 'The Block', 
        title: 'Solana DeFi Protocol Announces Major Airdrop', 
        timeAgo: '5h ago', 
        url: '#',
        date: 'July 14, 2024',
        author: 'Emily White',
        imageUrl: 'https://placehold.co/800x400.png',
        data-ai-hint: 'solana blockchain',
        content: [
            "A popular decentralized finance (DeFi) protocol on the Solana blockchain has announced a major airdrop, rewarding its early users and liquidity providers with a new governance token. The move is expected to decentralize control of the protocol and incentivize long-term participation from its community.",
            "The airdrop has generated significant buzz within the Solana ecosystem, leading to a surge in transaction volume and a spike in the price of the protocol's native assets. This event highlights the growing trend of community-owned DeFi projects and the power of airdrops as a user acquisition and retention tool."
        ]
    },
    { 
        id: 'us-crypto-framework', 
        source: 'Decrypt', 
        title: 'Regulatory Update: US Senator Proposes New Crypto Framework', 
        timeAgo: '8h ago', 
        url: '#',
        date: 'July 14, 2024',
        author: 'Michael Brown',
        imageUrl: 'https://placehold.co/800x400.png',
        data-ai-hint: 'government building',
        content: [
            "A bipartisan group of US senators has introduced a new legislative framework aimed at providing regulatory clarity for the cryptocurrency industry. The proposed bill seeks to define the roles of the SEC and CFTC in overseeing digital assets, establish a clear process for registering crypto exchanges, and provide consumer protections against fraud and market manipulation.",
            "While the bill is still in its early stages, it has been met with cautious optimism from industry leaders, who have long called for a more predictable regulatory environment. The coming months will be crucial as lawmakers debate the details of the proposed framework and its potential impact on the future of crypto in the United States."
        ]
    },
    { 
        id: 'nft-market-recovery', 
        source: 'Cointelegraph', 
        title: 'NFT Market Shows Signs of Recovery with New Blue-Chip Collection', 
        timeAgo: '1d ago', 
        url: '#',
        date: 'July 13, 2024',
        author: 'Sarah Green',
        imageUrl: 'https://placehold.co/800x400.png',
        data-ai-hint: 'digital art',
        content: [
            "After a prolonged bear market, the NFT space is showing signs of life with the successful launch of a new 'blue-chip' collection. The project, which features a unique blend of generative art and community-driven storytelling, sold out within minutes and has seen its floor price triple on secondary markets.",
            "This renewed excitement is seen by many as a positive indicator for the broader NFT market, suggesting that collectors are still eager to invest in high-quality projects with strong fundamentals. As the space continues to mature, the focus is shifting from speculative hype to genuine utility and artistic merit."
        ]
    },
    {
        id: 'gold-price-inflation',
        source: 'Bloomberg',
        title: 'Gold Prices Rally Amidst Global Inflation Concerns',
        timeAgo: '3h ago',
        url: '#',
        date: 'July 15, 2024',
        author: 'David Chen',
        imageUrl: 'https://placehold.co/800x400.png',
        data-ai-hint: 'gold bars',
        content: [
            "Gold has reasserted its status as a safe-haven asset, with prices rallying to a six-month high. The surge is driven by mounting concerns over persistent global inflation and geopolitical instability. Central banks around the world have also increased their gold reserves, further bolstering demand.",
            "Investors are flocking to the precious metal as a hedge against currency devaluation and economic uncertainty. Market analysts suggest that if inflationary pressures continue, gold could test its all-time highs before the end of the year."
        ]
    },
    {
        id: 'stock-market-fed',
        source: 'Wall Street Journal',
        title: 'Stock Market on Edge as Investors Await Federal Reserve Decision',
        timeAgo: '6h ago',
        url: '#',
        date: 'July 15, 2024',
        author: 'Jessica Lee',
        imageUrl: 'https://placehold.co/800x400.png',
        data-ai-hint: 'stock market chart',
        content: [
            "The stock market experienced a volatile trading session today as investors anxiously await the Federal Reserve's upcoming decision on interest rates. The S&P 500 and Nasdaq both saw modest declines, with the tech sector being particularly sensitive to potential rate hikes.",
            "All eyes are on the Fed's commentary, which will provide crucial insights into their outlook on the economy and future monetary policy. A more hawkish tone could trigger a market sell-off, while a dovish stance might fuel a relief rally. The uncertainty has led to a spike in the VIX, often referred to as the market's 'fear gauge'."
        ]
    }
];
