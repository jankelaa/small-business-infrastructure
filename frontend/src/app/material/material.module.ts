import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule} from '@angular/material/toolbar';

const MaterialComponent = [
  MatButtonModule,
  MatIconModule,
  MatBadgeModule,
  MatToolbarModule
];

@NgModule({
  imports: [MaterialComponent],
  exports: [MaterialComponent]
})
export class MaterialModule { }
