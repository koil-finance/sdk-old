import { BigNumberish } from '@ethersproject/bignumber';
import { Network } from './lib/constants/network';
import { Contract } from '@ethersproject/contracts';
import { PoolDataService, TokenPriceService } from '@koil-finance/sor';

export interface KoilSDKConfig {
    //use a known network or provide an entirely custom config
    network: Network | KoilNetworkConfig;
    rpcUrl: string;
    //overwrite the subgraph url if you don't want to use the koil finance maintained version
    customSubgraphUrl?: string;
    //optionally overwrite parts of the standard SOR config
    sor?: Partial<KoilSdkSorConfig>;
}

export interface KoilSdkSorConfig {
    //use a built-in service or provide a custom implementation of a TokenPriceService
    //defaults to coingecko
    tokenPriceService: 'coingecko' | 'subgraph' | TokenPriceService;
    //use a built-in service or provide a custom implementation of a PoolDataService
    //defaults to subgraph
    poolDataService: 'subgraph' | PoolDataService;
    //if a custom PoolDataService is provided, on chain balance fetching needs to be handled externally
    //default to true.
    fetchOnChainBalances: boolean;
}

export interface KoilNetworkConfig {
    chainId: Network;
    vault: string;
    weth: string;
    multicall: string;
    staBal3Pool?: {
        id: string;
        address: string;
    };
    wethStaBal3?: {
        id: string;
        address: string;
    };
    subgraphUrl: string;
}

export enum PoolSpecialization {
    GeneralPool = 0,
    MinimalSwapInfoPool,
    TwoTokenPool,
}

// Joins

export type JoinPoolRequest = {
    assets: string[];
    maxAmountsIn: BigNumberish[];
    userData: string;
    fromInternalBalance: boolean;
};

// Exit

export type ExitPoolRequest = {
    assets: string[];
    minAmountsOut: string[];
    userData: string;
    toInternalBalance: boolean;
};

// Balance Operations

export enum UserBalanceOpKind {
    DepositInternal = 0,
    WithdrawInternal,
    TransferInternal,
    TransferExternal,
}

export type UserBalanceOp = {
    kind: UserBalanceOpKind;
    asset: string;
    amount: BigNumberish;
    sender: string;
    recipient: string;
};

export enum PoolBalanceOpKind {
    Withdraw = 0,
    Deposit = 1,
    Update = 2,
}

export type PoolBalanceOp = {
    kind: PoolBalanceOpKind;
    poolId: string;
    token: string;
    amount: BigNumberish;
};

export interface TransactionData {
    contract?: Contract;
    function: string;
    params: string[];
    outputs?: {
        amountsIn?: string[];
        amountsOut?: string[];
    };
}
