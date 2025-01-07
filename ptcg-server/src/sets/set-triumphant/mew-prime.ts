import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameMessage,
  ChooseAttackPrompt, PowerType,
  EnergyMap,
  GameError,
  Player,
  Card,
  ChooseCardsPrompt,
  GameLog,
  ShuffleDeckPrompt
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class Mew extends PokemonCard {

  public tags = [CardTag.PRIME];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [];

  public powers = [{
    name: 'Lost Link',
    powerType: PowerType.POKEBODY,
    useWhenInPlay: true,
    text: 'Mew can use the attacks of all of the Pokémon in the Lost Zone (both yours and your opponent\'s). (You still need the necessary Energy to use each attack.) '
  }];

  public attacks = [
    {
      name: 'See Off',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'Search your deck for 1 Pokémon and put it in the Lost Zone. Shuffle your deck afterward.'
    }
  ];

  public set: string = 'TM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public name: string = 'Mew';

  public fullName: string = 'Mew TM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let cards: Card[] = [];

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 1, allowCancel: true }
      ), selected => {
        cards = selected || [];

        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, player.lostzone);

          store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_LOST_ZONE, { name: player.name, card: card.name });
        });
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Build cards and blocked for Choose Attack prompt
      const { pokemonCards, blocked } = this.buildAttackList(state, store, player);

      // No attacks to copy
      if (pokemonCards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_COPY,
        pokemonCards,
        { allowCancel: false, blocked }
      ), attack => {
        if (attack !== null) {
          const useAttackEffect = new UseAttackEffect(player, attack);
          store.reduceEffect(state, useAttackEffect);
        }
      });
    }
    return state;
  }

  private buildAttackList(
    state: State, store: StoreLike, player: Player
  ): { pokemonCards: PokemonCard[], blocked: { index: number, attack: string }[] } {

    const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    const energyMap = checkProvidedEnergyEffect.energyMap;

    const pokemonCards: PokemonCard[] = [];
    const blocked: { index: number, attack: string }[] = [];
    player.lostzone.cards.forEach(card => {
      if (card instanceof PokemonCard) {
        this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
      }
    });

    return { pokemonCards, blocked };
  }

  private checkAttack(state: State, store: StoreLike, player: Player,
    card: PokemonCard, energyMap: EnergyMap[], pokemonCards: PokemonCard[],
    blocked: { index: number, attack: string }[]
  ) {
    {

      const attacks = card.attacks.filter(attack => {
        const checkAttackCost = new CheckAttackCostEffect(player, attack);
        state = store.reduceEffect(state, checkAttackCost);
        return StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost as CardType[]);
      });
      const index = pokemonCards.length;
      pokemonCards.push(card);
      card.attacks.forEach(attack => {
        if (!attacks.includes(attack)) {
          blocked.push({ index, attack: attack.name });
        }
      });
    }
  }
}