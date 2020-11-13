import { trigger, state, style, animate, transition } from '@angular/animations';


export function dissolve() {
    return trigger('dissolve', [
        state('*', style({
            opacity: 1
        })),
        transition(':enter', [
            style({                
                opacity: 0
            }),
            animate('500ms ease-in', style({
                opacity: 1,                
            }))
        ]),
        transition(':leave', [
            style({                
                opacity: 1
            }),
            animate('500ms ease-out', style({
                opacity: 0,                
            }))
        ]),
    ])
}
