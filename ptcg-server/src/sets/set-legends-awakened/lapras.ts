import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import {
  PowerType, StoreLike, State, PlayerType,
  StateUtils, GameLog, ConfirmPrompt, ChooseCardsPrompt,
  ShuffleDeckPrompt, ShowCardsPrompt, TrainerType
} from '../../game';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';

export class Lapras extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = W;

  public hp: number = 80;

  public weakness = [{ type: L }];

  public retreat = [C, C];

  public powers = [{
    name: 'Support Navigation',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Lapras onto your Bench ' +
      'from your hand, you may search your deck for a Supporter card, ' +
      'show it to your opponent, and put it into your hand. ' +
      'Shuffle your deck afterward.'
  }];

  public attacks = [
    {
      name: 'Surf',
      cost: [W, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'LM';

  public name: string = 'Lapras';

  public fullName: string = 'Lapras LM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Support Navigation Poké-POWER
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        return state;
      }

      // Check if something is blocking the power
      try {
        const stub = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), wantToUse => {
        if (wantToUse) {
          store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, {
            name: player.name,
            ability: this.powers[0].name
          });

          state = store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.deck,
            { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
            { min: 0, max: 1, allowCancel: false }
          ), selected => {
            const cards = selected || [];
            if (cards.length > 0) {
              store.prompt(state, [new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                cards
              )], () => {
                cards.forEach(card => {
                  store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, {
                    name: player.name,
                    card: card.name
                  });
                });
                player.deck.moveCardsTo(cards, player.hand);
              });
            }
            return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          });
        }
      });
    }

    return state;
  }
}
