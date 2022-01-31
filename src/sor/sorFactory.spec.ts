import dotenv from 'dotenv';
import { expect } from 'chai';
import { KoilSDKConfig, KoilSdkSorConfig, Network, KoilSDK } from '@/.';
import { SorFactory } from '@/sor/sorFactory';
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

describe('sorFactory', () => {
    context('createSor', () => {
        it('instantiate via module', async () => {
            const sor = SorFactory.createSor(sdkConfig);
            await sor.fetchPools();
            const pools = sor.getPools();
            expect(pools).to.deep.eq([mockPool]);
            const providerNetwork = await sor.provider.getNetwork();
            expect(providerNetwork.chainId).to.eq(sdkConfig.network);
        });

        it('instantiate via SDK', async () => {
            const koil = new KoilSDK(sdkConfig);

            await koil.sor.fetchPools();
            const pools = koil.sor.getPools();
            expect(pools).to.deep.eq([mockPool]);
            const providerNetwork = await koil.sor.provider.getNetwork();
            expect(providerNetwork.chainId).to.eq(sdkConfig.network);
        });
    });
});
