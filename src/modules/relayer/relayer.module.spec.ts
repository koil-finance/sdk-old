import dotenv from 'dotenv';
import { expect } from 'chai';
import { KoilSDKConfig, KoilSdkSorConfig, Network, KoilSDK } from '@/.';
import { Relayer } from './relayer.module';
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

describe('relayer module', () => {
    context('instantiation', () => {
        it('instantiate via module', async () => {
            const relayer = new Relayer(sdkConfig);
            await relayer.fetchPools();
            const pools = relayer.getPools();
            expect(pools).to.deep.eq([mockPool]);
        });

        it('instantiate via SDK', async () => {
            const koil = new KoilSDK(sdkConfig);

            await koil.relayer.fetchPools();
            const pools = koil.relayer.getPools();
            expect(pools).to.deep.eq([mockPool]);
        });
    });
});
