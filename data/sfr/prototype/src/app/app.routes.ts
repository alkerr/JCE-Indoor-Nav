import { Routes } from "@angular/router"



import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ContactasComponent } from './contactas/contactas.component';



export const appRoutes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "profile", component: ProfileComponent },
  { path: "about", component: AboutComponent },
  { path: "gallery", component: GalleryComponent },
  { path: "contact-as", component: ContactasComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
  ];
