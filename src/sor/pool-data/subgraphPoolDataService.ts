import { PoolDataService, SubgraphPoolBase } from '@koil-finance/sor';
import {
    OrderDirection,
    Pool_OrderBy,
    SubgraphClient,
} from '../../subgraph/subgraph';
import { parseInt } from 'lodash';
import { getOnChainBalances } from './onChainData';
import { Provider } from '@ethersproject/providers';
import { Network } from '@/lib/constants/network';
import { KoilNetworkConfig, KoilSdkSorConfig } from '../../types';

const NETWORKS_WITH_LINEAR_POOLS: Network[] = [];

export class SubgraphPoolDataService implements PoolDataService {
    constructor(
        private readonly client: SubgraphClient,
        private readonly provider: Provider,
        private readonly network: KoilNetworkConfig,
        private readonly sorConfig: KoilSdkSorConfig
    ) {}

    public async getPools(): Promise<SubgraphPoolBase[]> {
        const pools = this.supportsLinearPools
            ? await this.getLinearPools()
            : await this.getNonLinearPools();

        const mapped = pools.map((pool) => ({
            ...pool,
            poolType: pool.poolType || '',
            tokens: (pool.tokens || []).map((token) => ({
                ...token,
                weight: token.weight || null,
            })),
            totalWeight: pool.totalWeight || undefined,
            amp: pool.amp || undefined,
            expiryTime: pool.expiryTime ? parseInt(pool.expiryTime) : undefined,
            unitSeconds: pool.unitSeconds
                ? parseInt(pool.unitSeconds)
                : undefined,
            principalToken: pool.principalToken || undefined,
            baseToken: pool.baseToken || undefined,
        }));

        if (this.sorConfig.fetchOnChainBalances === false) {
            return mapped;
        }

        return getOnChainBalances(
            mapped,
            this.network.multicall,
            this.network.vault,
            this.provider
        );
    }

    private get supportsLinearPools() {
        return NETWORKS_WITH_LINEAR_POOLS.includes(this.network.chainId);
    }

    private async getLinearPools() {
        const { pools } = await this.client.Pools({
            where: { swapEnabled: true },
            orderBy: Pool_OrderBy.TotalLiquidity,
            orderDirection: OrderDirection.Desc,
            first: 1000,
        });

        return pools;
    }

    private async getNonLinearPools() {
        const { pools } = await this.client.PoolsWithoutLinear({
            where: { swapEnabled: true },
            orderBy: Pool_OrderBy.TotalLiquidity,
            orderDirection: OrderDirection.Desc,
            first: 1000,
        });

        return pools;
    }
}
