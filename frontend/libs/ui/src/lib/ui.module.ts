import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BannerComponent } from './banner/banner.component';
import { SliderComponent } from './slider/slider.component';
import { NgPrimeModule } from './ng-prime/ng-prime.module';
import { GalleryComponent } from './components/gallery/gallery.component';

@NgModule({
    imports: [CommonModule, NgPrimeModule],
    declarations: [BannerComponent, SliderComponent, GalleryComponent],
    exports: [BannerComponent, SliderComponent, GalleryComponent, NgPrimeModule]
})
export class UiModule {}
