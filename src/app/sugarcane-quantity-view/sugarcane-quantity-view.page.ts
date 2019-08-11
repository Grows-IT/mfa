import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sugarcane-quantity-view',
  templateUrl: './sugarcane-quantity-view.page.html',
  styleUrls: ['./sugarcane-quantity-view.page.scss'],
})
export class SugarcaneQuantityViewPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public area;
  public areaWidth;
  public gap;
  public caneBlock;
  public totalWeightAll;
  public totalOutput;
  public showResult = false;
  calculateTotalWeight() {
    const areaLenght =this.area*1600/this.areaWidth
    const totalGap = this.areaWidth/this.gap
    const totalCaneBlock=areaLenght*totalGap*(12*this.caneBlock)
    
    const totalWeight=totalCaneBlock*0.002
    //this.totalOutput=totalWeight/this.area
    this.totalWeightAll=Math.floor(this.area*1600/this.areaWidth*this.areaWidth/this.gap*this.caneBlock*0.002)
    this.totalOutput=Math.floor(this.area*1600/this.areaWidth*this.areaWidth/this.gap*this.caneBlock*0.002/this.area)
    this.showResult = true;
  }
}
