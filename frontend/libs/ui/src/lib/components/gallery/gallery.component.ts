import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'ui-gallery',
    templateUrl: './gallery.component.html'
})
export class GalleryComponent implements OnChanges {
    @Input() public images: string[];
    public selectedImageUrl = '';

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.images) {
            this._setMainImage();
        }
    }

    onSelectImage(imageUrl: string): void {
        this.selectedImageUrl = imageUrl;
    }

    private _setMainImage(): void {
        if (this.images && this.images.length > 0) {
            this.selectedImageUrl = this.images[0];
        }
    }
}
