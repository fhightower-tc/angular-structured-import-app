import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
}
from '@angular/router';
import { MainComponent } from './main.component';
import { SpacesBaseService } from 'spaces-ng';
import { ActComponent } from './components/act/act.component';

const routes: Routes = [{
    path: '',
    component: MainComponent,
    resolve: {base: SpacesBaseService},
  }, {
    path: 'index.html',
    component: MainComponent,
    resolve: {base: SpacesBaseService},
  }, {
    path: 'act',
    component: ActComponent,
    resolve: {base: SpacesBaseService},
  }];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
