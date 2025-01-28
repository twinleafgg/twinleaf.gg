import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Slugma extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Combustion',
      cost: [ R, C ],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'KSS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Slugma';
  public fullName: string = 'Slugma KSS';
}