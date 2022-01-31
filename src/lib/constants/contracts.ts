import { Network } from './network';
import { KoilNetworkConfig } from '@/types';

export const koilVault = '0x48F76d2Be0f335b2be88589A1889d5198E6B3551';

export const KOIL_NETWORK_CONFIG: Record<Network, KoilNetworkConfig> = {
    [Network.FUSE]: {
        chainId: Network.FUSE, // 122
        vault: '0x48F76d2Be0f335b2be88589A1889d5198E6B3551',
        weth: '0x0BE9e53fd7EDaC9F859882AfdDa116645287C629',
        multicall: '0x133D83f1B2D7830816C80F907bbEf923CBc361Bc',
        subgraphUrl:
            'https://api.thegraph.com/subgraphs/name/koil-finance/koil-finance',
    },
};
