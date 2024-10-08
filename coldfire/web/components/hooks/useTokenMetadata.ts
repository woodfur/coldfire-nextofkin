import { useQuery } from '@tanstack/react-query';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection } from '@solana/wallet-adapter-react';

interface TokenMetadata {
  name: string;
  symbol: string;
  image: string;
  balance: number;
  usdValue?: number;
}

async function fetchTokenMetadata(mintAddress: string, connection: Connection): Promise<TokenMetadata> {
  try {
    const mintPublicKey = new PublicKey(mintAddress);
    
    // Fetch token account info
    const tokenAccountInfo = await connection.getParsedAccountInfo(mintPublicKey);
    if (!tokenAccountInfo.value) throw new Error('Token account not found');

    const parsedData: any = tokenAccountInfo.value.data;
    if (!parsedData.parsed || !parsedData.parsed.info) throw new Error('Unable to parse token data');

    const tokenInfo = parsedData.parsed.info;

    // For devnet tokens, we might not have a name or symbol, so we'll use placeholders
    const name = tokenInfo.name || 'Unknown Token';
    const symbol = tokenInfo.symbol || 'UNK';

    // Fetch token balance (you might need to adjust this based on your specific requirements)
    const balance = tokenInfo.supply ? parseInt(tokenInfo.supply) / Math.pow(10, tokenInfo.decimals) : 0;

    // TODO: Implement USD value fetching. This might require integrating with a price feed API.
    // For now, we'll leave it undefined
    const usdValue = undefined;

    return {
      name,
      symbol,
      image: '', // We don't have image info for devnet tokens
      balance,
      usdValue
    };
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return {
      name: 'Unknown Token',
      symbol: 'UNK',
      image: '',
      balance: 0,
      usdValue: undefined
    };
  }
}

export function useTokenMetadata(mintAddress: string) {
  const { connection } = useConnection();

  return useQuery<TokenMetadata>({
    queryKey: ['token-metadata', mintAddress],
    queryFn: () => fetchTokenMetadata(mintAddress, connection),
  });
}

// Export fetchTokenMetadata for use outside of React components
export { fetchTokenMetadata };