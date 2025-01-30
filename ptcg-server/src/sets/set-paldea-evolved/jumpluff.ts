import { ChoosePokemonPrompt, CoinFlipPrompt, GameLog, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Jumpluff extends PokemonCard {
    public stage: Stage = Stage.STAGE_2;
    public cardType: CardType = G;
    public hp: number = 90;
    public weakness = [{ type: F }];
    public retreat = [C];

    public powers = [{
        powerType: PowerType.ABILITY,
        name: 'Drifting Dodge',
        text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage.',
        useWhenInPlay: false,
    }];

    public attacks = [{
        name: 'Fluffy Breeze',
        cost: [G],
        damage: 60,
        text: "This attack also does 30 damage to 1 of your opponent's Benched Pokémon. (Don’t apply Weakness and Resistance for Benched Pokémon.)",
    }];

    public set: string = 'PAL';
    public regulationMark: string = 'G';
    public cardImage: string = 'assets/cardback.png';
    public setNumber: string = '3';
    public name: string = 'Jumpluff';
    public fullName: string = 'Jumpluff PAL';

    public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

        if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const opponent = StateUtils.getOpponent(state, player);

            // Stop this effect if this card's Ability is locked
            try {
                const stub = new PowerEffect(player, {
                    name: 'test',
                    powerType: PowerType.ABILITY,
                    text: '',
                }, this);
                store.reduceEffect(state, stub);
            } catch {
                return state;
            }

            return store.prompt(state, [
                new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.preventDefault = true;
                    store.log(state, GameLog.LOG_ABILITY_BLOCKS_DAMGE, { name: opponent.name, pokemon: this.name });
                    return state;
                }
            });
        }

        if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = StateUtils.getOpponent(state, player);
                
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
                
            state = store.prompt(state, new ChoosePokemonPrompt(
                player.id,
                GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
                PlayerType.TOP_PLAYER,
                [ SlotType.BENCH ],
                { allowCancel: false }
            ), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
                
            return state;
        }

        return state;
    }
}