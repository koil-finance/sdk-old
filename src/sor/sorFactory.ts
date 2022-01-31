import { SOR, TokenPriceService } from '@koil-finance/sor';
import { Provider, JsonRpcProvider } from '@ethersproject/providers';
import { KOIL_NETWORK_CONFIG } from '@/lib/constants/contracts';
import { SubgraphPoolDataService } from './pool-data/subgraphPoolDataService';
import { CoingeckoTokenPriceService } from './token-price/coingeckoTokenPriceService';
import { SubgraphClient, createSubgraphClient } from '../subgraph/subgraph';
import { KoilNetworkConfig, KoilSDKConfig, KoilSdkSorConfig } from '../types';
import { SubgraphTokenPriceService } from './token-price/subgraphTokenPriceService';

export class SorFactory {
    public static createSor(sdkConfig: KoilSDKConfig): SOR {
        const network = this.getNetworkConfig(sdkConfig);
        const sorConfig = SorFactory.getSorConfig(sdkConfig);
        const provider = new JsonRpcProvider(sdkConfig.rpcUrl);
        const subgraphClient = createSubgraphClient(network.subgraphUrl);

        const poolDataService = SorFactory.getPoolDataService(
            network,
            sorConfig,
            provider,
            subgraphClient
        );

        const tokenPriceService = SorFactory.getTokenPriceService(
            network,
            sorConfig,
            subgraphClient
        );

        return new SOR(provider, network, poolDataService, tokenPriceService);
    }

    private static getNetworkConfig(config: KoilSDKConfig): KoilNetworkConfig {
        if (typeof config.network === 'number') {
            const networkConfig = KOIL_NETWORK_CONFIG[config.network];

            return {
                ...networkConfig,
                subgraphUrl:
                    config.customSubgraphUrl ?? networkConfig.subgraphUrl,
            };
        }

        return {
            ...config.network,
            subgraphUrl: config.customSubgraphUrl ?? config.network.subgraphUrl,
        };
    }

    private static getSorConfig(config: KoilSDKConfig): KoilSdkSorConfig {
        return {
            tokenPriceService: 'coingecko',
            poolDataService: 'subgraph',
            fetchOnChainBalances: true,
            ...config.sor,
        };
    }

    private static getPoolDataService(
        network: KoilNetworkConfig,
        sorConfig: KoilSdkSorConfig,
        provider: Provider,
        subgraphClient: SubgraphClient
    ) {
        return typeof sorConfig.poolDataService === 'object'
            ? sorConfig.poolDataService
            : new SubgraphPoolDataService(
                  subgraphClient,
                  provider,
                  network,
                  sorConfig
              );
    }

    private static getTokenPriceService(
        network: KoilNetworkConfig,
        sorConfig: KoilSdkSorConfig,
        subgraphClient: SubgraphClient
    ): TokenPriceService {
        if (typeof sorConfig.tokenPriceService === 'object') {
            return sorConfig.tokenPriceService;
        } else if (sorConfig.tokenPriceService === 'subgraph') {
            new SubgraphTokenPriceService(subgraphClient, network.weth);
        }

        return new CoingeckoTokenPriceService(network.chainId);
    }
}
