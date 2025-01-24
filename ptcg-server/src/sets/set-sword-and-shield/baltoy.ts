import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Baltoy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 70;
  public weakness = [{ type: CardType.GRASS }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Beam',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: ''
  },
  {
    name: 'Sand Spray',
    cost: [CardType.FIGHTING, CardType.FIGHTING],
    damage: 30,
    text: ''
  }];

  public set = 'SSH';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name = 'Baltoy';
  public fullName = 'Baltoy SSH';
}
