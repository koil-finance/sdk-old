import { KoilSDKConfig } from '../types';
import { Swaps } from './swaps/swaps.module';
import { Relayer } from './relayer/relayer.module';
import { SOR } from '@koil-finance/sor';
import { SorFactory } from '../sor/sorFactory';

export class KoilSDK {
    public readonly swaps: Swaps;
    public readonly relayer: Relayer;
    public readonly sor: SOR;

    constructor(config: KoilSDKConfig) {
        this.sor = SorFactory.createSor(config);
        this.swaps = new Swaps(this.sor);
        this.relayer = new Relayer(this.swaps);
    }
}
