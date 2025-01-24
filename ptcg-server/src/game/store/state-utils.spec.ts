import { CardType, SuperType } from './card/card-types';
import { EnergyMap } from './prompts/choose-energy-prompt';
import { StateUtils } from './state-utils';
import { BlendEnergyWLFM } from '../../sets/set-dragons-exalted/blend-energy-wlfm';
import { Effect } from './effects/effect';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from './effects/check-effects';
import { StoreLike } from './store-like';
import { State } from './state/state';
import { ZeraoraGX } from '../../sets/set-lost-thunder/zeraora-gx';
import { UnitEnergyLPM } from '../../sets/set-ultra-prism/unit-energy-lpm';

describe('StateUtils', () => {

  // let playerId: number;
  let fire: CardType[];
  let fighting: CardType[];
  let lightning: CardType[];
  let water: CardType[];
  let unitFdy: CardType[];
  let blendWLFM: CardType[];
  let unitLPM: CardType[];
  let unitGRW: CardType[];
  let rainbow: CardType[];
  let blendGRPD: CardType[];
  // let dark: CardType[];
  // let colorless: CardType[];
  // let dce: CardType[];

  function createEnergy(name: string, provides: CardType[]): EnergyMap {
    const card = { name, superType: SuperType.ENERGY, provides } as any;
    return { card, provides };
  }

  beforeEach(() => {
    // playerId = 1;
    fire = [ R ];
    fighting = [ F ];
    lightning = [ L ];
    water = [ W ];
    unitFdy = [ CardType.FDY ];
    blendWLFM = [ CardType.WLFM ];
    unitLPM = [ CardType.LPM ];
    unitGRW = [ CardType.GRW ];
    rainbow = [ CardType.ANY ];
    blendGRPD = [ CardType.GRPD ];
    // dce = [ C, C ];
  });

  it('Should return true, when provided the correct energy', () => {
    // given
    const cost: CardType[] = [ R ];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
  
  it('Should return false when provided too few energy', () => {
    // given
    const cost: CardType[] = [ R, R ];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
  });
  
  it('Should return true when provided rainbow energy', () => {
    // given
    const cost: CardType[] = [ R, R ];
    const energy: EnergyMap[] = [
      createEnergy('fire', fire),
      createEnergy('rainbow', rainbow)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
  
  it('Should return true when provided fdy', () => {
    // given
    const cost: CardType[] = [ F, Y ];
    const energy: EnergyMap[] = [
      createEnergy('fighting', fighting),
      createEnergy('unitFdy', unitFdy)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
  
  it('Should return true when provided with multiple blends that match out of order energy cost', () => {
    // given
    const cost: CardType[] = [ W, L ];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('blendWLFM', blendWLFM),
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
  
  it('Should return true when provided with multiple blends and a rainbow that match out of order energy cost', () => {
    // given
    const cost: CardType[] = [ W, L, G ];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('rainbow', rainbow),
      createEnergy('blendWLFM', blendWLFM),
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
  
  it('Should return true when provided with too much energy', () => {
    // given
    const cost: CardType[] = [ F, F ];
    const energy: EnergyMap[] = [
      createEnergy('fighting', fighting),
      createEnergy('fighting', fighting),
      createEnergy('unitFdy', unitFdy)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
  
  it('Should return true when provided with all rainbows', () => {
    // given
    const cost: CardType[] = [ F, F ];
    const energy: EnergyMap[] = [
      createEnergy('rainbow', rainbow),
      createEnergy('rainbow', rainbow),
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle two Unit LPM for {L}{L} cost', () => {
    // given
    const cost: CardType[] = [ L, L ];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM1', unitLPM),
      createEnergy('unitLPM2', unitLPM)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle two Unit GRW for {R}{R} cost', () => {
    // given
    const cost: CardType[] = [ R, R ];
    const energy: EnergyMap[] = [
      createEnergy('unitGRW1', unitGRW),
      createEnergy('unitGRW2', unitGRW)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle different multi-energies for same type cost', () => {
    // given
    const cost: CardType[] = [ R, R ];
    const energy: EnergyMap[] = [
      createEnergy('unitGRW', unitGRW),
      createEnergy('blendGRPD', blendGRPD)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle Unit LPM + Blend WLFM for {L}{M} cost', () => {
    // given
    const cost: CardType[] = [ L, M ];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('blendWLFM', blendWLFM)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle Unit GRW + Blend GRPD for {R}{W} cost', () => {
    // given
    const cost: CardType[] = [ R, W ];
    const energy: EnergyMap[] = [
      createEnergy('unitGRW', unitGRW),
      createEnergy('blendGRPD', blendGRPD)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });
  
  it('Should handle two different Blend energies for {L}{P} cost', () => {
    // given
    const cost: CardType[] = [ L, P ];
    const energy: EnergyMap[] = [
      createEnergy('blendWLFM', blendWLFM),
      createEnergy('blendGRPD', blendGRPD)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle same Blend energy twice for {W}{F} cost', () => {
    // given
    const cost: CardType[] = [ W, F ];
    const energy: EnergyMap[] = [
      createEnergy('blendWLFM1', blendWLFM),
      createEnergy('blendWLFM2', blendWLFM)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should fail when one multi-energy provides a cost but not the other', () => {
    // given
    const cost: CardType[] = [ P, P ];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('blendWLFM', blendWLFM)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
  });

  it('Should handle complex mix of basic and multi-energies', () => {
    // given
    const cost: CardType[] = [ 
      L, 
      P, 
      W,
      C 
    ];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('blendWLFM', blendWLFM),
      createEnergy('lightning', lightning),
      createEnergy('water', water)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle ANY type from rainbow with multi-energies', () => {
    const cost: CardType[] = [ 
      L, 
      P, 
      W 
    ];
    const energy: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('rainbow', rainbow),
      createEnergy('blendWLFM', blendWLFM)
    ];

    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle energy assignment regardless of energy card order', () => {
    // given
    const cost: CardType[] = [ R, P ];
    
    const energy1: EnergyMap[] = [
      createEnergy('blendGRPD', blendGRPD),
      createEnergy('unitLPM', unitLPM)
    ];
    
    const energy2: EnergyMap[] = [
      createEnergy('unitLPM', unitLPM),
      createEnergy('blendGRPD', blendGRPD)
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy1, cost)).toBeTruthy();
    expect(StateUtils.checkEnoughEnergy(energy2, cost)).toBeTruthy();
  });

  it('Should handle Double Turbo Energy for {C}{C} cost', () => {
    // given
    const cost: CardType[] = [ C, C ];
    const energy: EnergyMap[] = [
      createEnergy('doubleTurbo', [ C, C ])
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle Double Dragon Energy for {R}{L} cost', () => {
    // given
    const cost: CardType[] = [ R, L ];
    const energy: EnergyMap[] = [
      createEnergy('doubleDragon', [ CardType.ANY, CardType.ANY ])
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should handle Rapid Strike Energy for {W}{F} cost', () => {
    // given
    const cost: CardType[] = [ W, F ];
    const energy: EnergyMap[] = [
      createEnergy('rapidStrike', [ CardType.RAPID_STRIKE, CardType.RAPID_STRIKE ])
    ];

    // then
    expect(StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
  });

  it('Should count Blend WLFM as [W] for attack damage calculation', () => {
    // given
    const blendEnergy = new BlendEnergyWLFM();
    const checkEffect = new CheckProvidedEnergyEffect({
      id: 1,
      active: {
        cards: [blendEnergy]  // Need to include the energy card in the source
      }
    } as any);

    // Mock store to prevent EnergyEffect errors
    const mockStore = {
      reduceEffect: () => ({} as any)
    } as unknown as StoreLike;

    blendEnergy.reduceEffect(mockStore, {} as State, checkEffect);

    const energy: EnergyMap[] = [
      createEnergy('water', water),
      checkEffect.energyMap[0] // Use the actual energy map from BlendEnergyWLFM
    ];

    // Create a custom filter predicate like the one in Horsea's attack
    const waterFilter = (cardType: CardType) => 
      cardType === W || cardType === CardType.ANY;

    // Count total Water energies
    let waterCount = 0;
    energy.forEach(em => {
      waterCount += em.provides.filter(waterFilter).length;
    });

    // then
    expect(waterCount).toBe(2); // Should count both basic Water and Blend WLFM
  });

  it('Should count Unit Energy LPM as [L] for retreat cost abilities', () => {
    // given
    const zeraora = new ZeraoraGX();
    const unitEnergyLPM = new UnitEnergyLPM();
    
    // First check the provided energy
    const checkProvidedEnergy = new CheckProvidedEnergyEffect({
      id: 1,
      active: {
        cards: [zeraora, unitEnergyLPM],
        getPokemonCard: () => zeraora
      }
    } as any);

    // Then check retreat cost
    const checkRetreatCost = new CheckRetreatCostEffect({
      id: 1,
      active: {
        cards: [zeraora, unitEnergyLPM],
        getPokemonCard: () => zeraora
      }
    } as any);

    // Mock store to handle both effects
    const mockStore = {
      reduceEffect: (state: State, effect: Effect) => {
        if (effect instanceof CheckProvidedEnergyEffect) {
          effect.energyMap.push({
            card: unitEnergyLPM,
            provides: [L, P, M]
          });
        }
        return state;
      }
    } as unknown as StoreLike;

    // when - first get the energy provided
    unitEnergyLPM.reduceEffect(mockStore, {} as State, checkProvidedEnergy);
    // then check if it affects retreat cost
    zeraora.reduceEffect(mockStore, {} as State, checkRetreatCost);

    // then
    expect(checkRetreatCost.cost).toEqual([]);
  });
});
