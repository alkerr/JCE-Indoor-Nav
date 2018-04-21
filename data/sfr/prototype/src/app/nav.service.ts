import { Injectable } from '@angular/core';
import { NavItem } from '../navItem';

@Injectable()
export class NavService {
  
  
  private _navList: NavItem[];
  constructor() {
    this._navList = [
        new NavItem("Home","home"),
        new NavItem("About","about"),
        new NavItem("Profile","profile")
    ];
  }

  public get navList(){return this._navList;}

}
