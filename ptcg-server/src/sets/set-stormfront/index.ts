import { Card } from '../../game/store/card/card';
import { Gastly } from './gastly';
import { LuxuryBall } from './luxury-ball';
import { PokeBlower } from './poke-blower';
import { PokeDrawer } from './poke-drawer';
import { Sableye } from './sableye';

export const setStormfront: Card[] = [
  new Gastly(),
  new LuxuryBall(),
  new PokeBlower(),
  new PokeDrawer(),
  new Sableye()
];
