import { NgModule } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColorPickerModule } from 'primeng/colorpicker';
import { EditorModule } from 'primeng/editor';
import { TagModule } from 'primeng/tag';
import { InputMaskModule } from 'primeng/inputmask';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FieldsetModule } from 'primeng/fieldset';
import { CheckboxModule } from 'primeng/checkbox';
import { RatingModule } from 'primeng/rating';
import { BadgeModule } from 'primeng/badge';

@NgModule({
    exports: [
        CardModule,
        DropdownModule,
        ToolbarModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        InputSwitchModule,
        ToastModule,
        ConfirmDialogModule,
        ColorPickerModule,
        EditorModule,
        TagModule,
        InputMaskModule,
        ProgressSpinnerModule,
        FieldsetModule,
        CheckboxModule,
        RatingModule,
        BadgeModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class NgPrimeModule {}
