import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class Charmander extends PokemonCard {

    public stage: Stage = Stage.BASIC;

    public tags = [ CardTag.DELTA_SPECIES ];

    public cardType: CardType = L;

    public hp: number = 50;

    public weakness = [{ type: W }];

    public retreat = [C];

    public attacks = [{
        name: 'Scratch',
        cost: [C],
        damage: 10,
        text: ''
    }, {
        name: 'Bite',
        cost: [L,C],
        damage: 20,
        text: ''
    }];

    public set = 'CG';

    public cardImage: string = 'assets/cardback.png';

    public setNumber = '49';

    public name = 'Charmander';

    public fullName = 'Charmander CG';
}
