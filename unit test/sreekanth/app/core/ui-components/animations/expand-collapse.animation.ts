// src/app/core/expand-collapse.animation.ts
import { trigger, transition, style, animate, state } from '@adapters/packageAdapter';

// OPTION 2:
export const expandCollapse = trigger('expandCollapse', [
  state('*', style({'overflow-y': 'hidden'})),
  state('void', style({'overflow-y': 'hidden'})),
  transition('* => void', [
    style({height: '*'}),
    animate('250ms ease-out', style({height: 0}))
  ]),
  transition('void => *', [
    style({height: 0}),
    animate('250ms ease-in', style({height: '*'}))
  ])
]);