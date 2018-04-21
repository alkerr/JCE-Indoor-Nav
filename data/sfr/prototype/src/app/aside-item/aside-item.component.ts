import { Component, OnInit, Input } from '@angular/core';
import { imageItem } from '../../imageItem';

@Component({
  selector: 'app-aside-item',
  templateUrl: './aside-item.component.html',
  styleUrls: ['./aside-item.component.css']
})
export class AsideItemComponent implements OnInit {
  @Input() item: imageItem
  constructor() { }


  
  ngOnInit() {
  }

}
