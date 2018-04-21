import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import { NavService } from './nav.service';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { RouterModule } from "@angular/router"
import {appRoutes} from './app.routes';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ContactasComponent } from './contactas/contactas.component';
import { AsideItemComponent } from './aside-item/aside-item.component'
import { ImagesService } from './images.service';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NavItemComponent,
    HeaderComponent,
    AsideComponent,
    HomeComponent,
    AboutComponent,
    ProfileComponent,
    GalleryComponent,
    ContactasComponent,
    AsideItemComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule
  ],
  providers: [
    NavService,
    ImagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
