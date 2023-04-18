import { NgModule } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColorPickerModule } from 'primeng/colorpicker';

@NgModule({
    exports: [
        CardModule,
        ToolbarModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        ToastModule,
        ConfirmDialogModule,
        ColorPickerModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class NgPrimeModule {}
