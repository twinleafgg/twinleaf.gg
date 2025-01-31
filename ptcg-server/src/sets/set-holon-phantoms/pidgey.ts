import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class Pidgey extends PokemonCard {

    public stage: Stage = Stage.BASIC;

    public tags = [ CardTag.DELTA_SPECIES ];

    public cardType: CardType = L;

    public hp: number = 40;

    public weakness = [{ type: L }];
    
    public resistances = [{ type: F, value:-30 }];

    public retreat = [C];

    public attacks = [{
        name: 'Wing Attack',
        cost: [C],
        damage: 10,
        text: ''
    }];

    public set = 'HP';

    public cardImage: string = 'assets/cardback.png';

    public setNumber = '77';

    public name = 'Pidgey';

    public fullName = 'Pidgey HP';
}
