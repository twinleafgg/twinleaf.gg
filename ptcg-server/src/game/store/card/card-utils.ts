import { CardType } from './card-types';

export class CardUtils {
  public static readonly SPECIAL_ENERGY_TYPES: Partial<Record<CardType, CardType[]>> = {
    [CardType.WLFM]: [W, L, F, M],
    [CardType.GRPD]: [G, R, P, D],
    [CardType.LPM]: [L, P, M],
    [CardType.GRW]: [G, R, W],
    [CardType.FDY]: [F, D, Y],
    [CardType.RAPID_STRIKE]: [W, F]
  };

  public static createSpecialEnergyArray(specialType: CardType): CardType[] {
    const providedTypes = this.SPECIAL_ENERGY_TYPES[specialType];
    if (!providedTypes) {
      return [specialType]; // Return original type if not special
    }

    const array = [specialType];
    
    // Override filter method
    Object.defineProperty(array, 'filter', {
      value: function(predicate: (type: CardType) => boolean) {
        // Check if predicate matches any of our provided types
        for (const type of providedTypes) {
          if (predicate(type)) {
            return [type];
          }
        }
        // Otherwise use normal filter
        return Array.prototype.filter.call(this, predicate);
      }
    });

    // Override includes method
    Object.defineProperty(array, 'includes', {
      value: function(searchElement: CardType): boolean {
        // Check if the type we're searching for is one of our provided types
        if (providedTypes.includes(searchElement)) {
          return true;
        }
        // Otherwise use normal includes
        return Array.prototype.includes.call(this, searchElement);
      }
    });

    return array;
  }
}