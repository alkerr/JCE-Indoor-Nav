import { Component, OnInit } from '@angular/core';

import {Observable} from 'rxjs/Rx';

import 'rxjs/add/observable/interval';
import { ImagesService } from '../images.service';


@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {
  private timer;



//  public  change() {
//     var temp;
//     temp=this.imagesService.imageList[0];
//     this.imagesService.imageList[0]=this.imagesService.imageList[1];
//     this.imagesService.imageList[1]=temp;
//   }


  public godnfloor(){
    if( this.imagesService.imageList[0].title=="floor -2")
    return;

    var temp;
    temp=this.imagesService.imageList[this.imagesService.imageList.length-1];

    for(let i=this.imagesService.imageList.length-1;i>0;i--){
      this.imagesService.imageList[i]=this.imagesService.imageList[i-1];
    }
    this.imagesService.imageList[0]=temp;

 
  }
  public goupfloor(){
    if( this.imagesService.imageList[0].title=="floor 4")
    return;
 
    var temp;
    temp=this.imagesService.imageList[0];

    for(let i=0;i<this.imagesService.imageList.length-1;i++){
      this.imagesService.imageList[i]=this.imagesService.imageList[i+1];
    }
    this.imagesService.imageList[this.imagesService.imageList.length-1]=temp;



  }


  constructor(public imagesService: ImagesService) {


}

  ngOnInit() {
    // var source = Observable.interval(10000 /* ms */).timeInterval()
    // var subscription = source.subscribe(() => {
    //   this.change();
        
    //  }
      
    // );
  }

}
