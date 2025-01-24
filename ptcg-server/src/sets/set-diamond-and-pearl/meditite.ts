import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt, GameMessage } from '../../game';
import { AbstractAttackEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Meditite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: P, value: +10 }];
  public resistance = [];
  public evolvesInto = 'Medicham';
  public retreat = [C];

  public attacks = [{
    name: 'Detect',
    cost: [F],
    damage: 10,
    text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Meditite during your opponent\’s next turn.'
  },
  {
    name: 'Meditate',
    cost: [ F, C ],
    damage: 10,
    text: 'Does 10 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
  }];

  public set = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name = 'Meditite';
  public fullName = 'Meditite DP';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          if (effect instanceof PutDamageEffect) {
            effect.preventDefault = true;
          }
          if (effect instanceof AbstractAttackEffect) {
            effect.preventDefault = true;
          }
        }
      }
      );
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.damage += opponent.active.damage;
      return state;
    }
    return state;
  }
}
