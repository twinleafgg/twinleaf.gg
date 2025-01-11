import { CardType, PokemonCard, Stage } from '../../game';

export class Gible extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = CardType.DRAGON;
  public hp: number = 70;
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Gnaw',
    cost: [CardType.WATER, CardType.FIRE],
    damage: 30,
    text: ''
  }];

  public regulationMark: string = 'F';
  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Gible';
  public fullName: string = 'Gible BRS';
}
