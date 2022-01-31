import dotenv from 'dotenv';
import { expect } from 'chai';

import { KoilSDKConfig, KoilSdkSorConfig, Network, KoilSDK, Swaps } from '@/.';
import { mockPool, mockPoolDataService } from '@/test/lib/mockPool';

dotenv.config();

const sorConfig: KoilSdkSorConfig = {
    tokenPriceService: 'coingecko',
    poolDataService: mockPoolDataService,
    fetchOnChainBalances: false,
};

const sdkConfig: KoilSDKConfig = {
    network: Network.FUSE,
    rpcUrl: 'https://rpc.fuse.io',
    sor: sorConfig,
};

describe('swaps module', () => {
    context('instantiation', () => {
        it('instantiate via module', async () => {
            const swaps = new Swaps(sdkConfig);
            await swaps.fetchPools();
            const pools = swaps.getPools();
            expect(pools).to.deep.eq([mockPool]);
        });

        it('instantiate via SDK', async () => {
            const koil = new KoilSDK(sdkConfig);
            await koil.swaps.fetchPools();
            const pools = koil.swaps.getPools();
            expect(pools).to.deep.eq([mockPool]);
        });
    });
});
