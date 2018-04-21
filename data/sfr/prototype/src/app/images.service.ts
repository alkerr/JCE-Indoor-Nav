import { Injectable } from '@angular/core';
import { imageItem } from '../imageItem';

@Injectable()
export class ImagesService {

  private _imageList: imageItem[];
  constructor() {
    this._imageList = [
      new imageItem("../assets/images/floors/-2.jpg","floor -2"),
      new imageItem("../assets/images/floors/-1.jpg","floor -1"),
        new imageItem("../assets/images/floors/1.jpg","floor 1"),
        new imageItem("../assets/images/floors/2.jpg","floor 2"),
        new imageItem("../assets/images/floors/3.jpg","floor 3"),
        new imageItem("../assets/images/floors/4.jpg","floor 4")

    ];
  }
  public get imageList(){return this._imageList;}


}
