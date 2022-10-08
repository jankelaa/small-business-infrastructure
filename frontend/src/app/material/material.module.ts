import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';

const MaterialModules = [
  MatButtonModule,
  MatIconModule,
  MatBadgeModule,
  MatToolbarModule,
  MatMenuModule,
  MatSidenavModule,
  MatListModule,
  MatStepperModule,
  MatRadioModule,
  MatTableModule
];

@NgModule({
  imports: [MaterialModules],
  exports: [MaterialModules]
})
export class MaterialModule { }
