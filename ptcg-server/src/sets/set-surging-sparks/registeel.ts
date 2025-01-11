import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Registeel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Raging Hammer',
    cost: [CardType.METAL, CardType.COLORLESS],
    damage: 60,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '125';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Registeel';
  public fullName: string = 'Registeel SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.player.active.damage; 
    }

    return state;
  }
}
