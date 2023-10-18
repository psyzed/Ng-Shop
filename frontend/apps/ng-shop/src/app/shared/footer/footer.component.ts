import { Component } from '@angular/core';

@Component({
    selector: 'ngshop-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent {
    public currentYear: number = new Date().getFullYear();
}
