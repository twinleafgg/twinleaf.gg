import { StoreLike, State,  GameMessage, ChoosePokemonPrompt,   PlayerType, SlotType    } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { GameError } from '../../game/game-error';
import { BoardEffect, CardType, Stage } from '../../game/store/card/card-types';
import { Card } from '../../game/store/card/card';
import {  PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { CardList } from '../../game/store/state/card-list';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';

function* useDivingSearch(next: Function, store: StoreLike, state: State,
  self: Swampert, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const deckTop = new CardList();

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK,
    player.deck,
    {},
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, deckTop);

  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
    if (cardList.getPokemonCard() === self) {
      cardList.addBoardEffect(BoardEffect.ABILITY_USED);
    }
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    if (order === null) {
      return state;
    }
    deckTop.applyOrder(order);
    deckTop.moveToTopOfDestination(player.deck);
  });
}








export class Swampert extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.WATER;
  public hp: number = 140;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
  {
    name: 'Hydro',
    cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
    damage: 40,
    text: 'This attack does 30 more damage for each {W} Energy attached to this Pokémon.'
  }];

  public set = 'PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name = 'Swampert';
  public fullName = 'Swampert PRC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
        const generator = useDivingSearch(() => generator.next(), store, state, this, effect);
        return generator.next().value;
  
      }
    

      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        const player = effect.player;
        
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const targets = selected || [];
  
          const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
          store.reduceEffect(state, checkProvidedEnergyEffect);
  
          let energyCount = 0;
          checkProvidedEnergyEffect.energyMap.forEach(em => {
            energyCount += em.provides.filter(cardType =>
              cardType === CardType.WATER || cardType === CardType.ANY
            ).length;
          });
  
          const damage = energyCount * 30;
  
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, damage);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
  
          return state;
        });
      }
      
      return state
  }

}