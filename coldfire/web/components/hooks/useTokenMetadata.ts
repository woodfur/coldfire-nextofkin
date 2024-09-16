import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface TokenMetadata {
  name: string;
  symbol: string;
  image: string;
}

const SOLANA_TOKEN_LIST_URL = 'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json';

export async function fetchTokenMetadata(mintAddress: string): Promise<TokenMetadata> {
    try {
      const response = await axios.get(SOLANA_TOKEN_LIST_URL);
      const tokenList = response.data.tokens;
      const token = tokenList.find((t: any) => t.address === mintAddress);
      
      if (token) {
        return {
          name: token.name,
          symbol: token.symbol,
          image: token.logoURI || '',
        };
      } else {
        // Return default values for unknown tokens
        return {
          name: 'Unknown Token',
          symbol: 'UNK',
          image: '',
        };
      }
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      throw error;
    }
  }
  
  export function useTokenMetadata(mintAddress: string) {
    return useQuery<TokenMetadata>({
      queryKey: ['token-metadata', mintAddress],
      queryFn: () => fetchTokenMetadata(mintAddress),
    });
  }