import {
  trigger, transition, style, animate, query, group
} from '@angular/animations';

export const slideRouteAnimation = trigger('routeAnimations', [

  transition('* => forward', [
    query(':enter, :leave', [
      style({
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        overflow: 'hidden'
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('320ms cubic-bezier(0.4,0,0.2,1)',
          style({ transform: 'translateX(-28%)', opacity: 0.5 }))
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(100%)', opacity: 1 }),
        animate('320ms cubic-bezier(0.4,0,0.2,1)',
          style({ transform: 'translateX(0)', opacity: 1 }))
      ], { optional: true })
    ])
  ]),

  transition('* => back', [
    query(':enter, :leave', [
      style({
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        overflow: 'hidden'
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('300ms cubic-bezier(0.4,0,0.2,1)',
          style({ transform: 'translateX(100%)', opacity: 0.5 }))
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(-28%)', opacity: 0.8 }),
        animate('300ms cubic-bezier(0.4,0,0.2,1)',
          style({ transform: 'translateX(0)', opacity: 1 }))
      ], { optional: true })
    ])
  ]),

  // Asegúrate de que back esté así:
transition('* => back', [
  query(':enter, :leave', [
    style({
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      overflow: 'hidden'
    })
  ], { optional: true }),
  group([
    query(':leave', [
      animate('300ms cubic-bezier(0.4,0,0.2,1)',
        style({ transform: 'translateX(100%)', opacity: 0.5 }))  // sale por la derecha
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(-28%)', opacity: 0.8 }),    // entra desde la izquierda
      animate('300ms cubic-bezier(0.4,0,0.2,1)',
        style({ transform: 'translateX(0)', opacity: 1 }))
    ], { optional: true })
  ])
]),

]);