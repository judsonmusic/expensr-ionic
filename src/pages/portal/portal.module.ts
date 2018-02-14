import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PortalPage } from './portal';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PortalPage,
  ],
  imports: [
    ComponentsModule,
    DirectivesModule,
    PipesModule,
    IonicPageModule.forChild(PortalPage),
  ],
})
export class PortalPageModule {}
