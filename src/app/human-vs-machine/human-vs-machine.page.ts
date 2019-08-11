import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-human-vs-machine',
  templateUrl: './human-vs-machine.page.html',
  styleUrls: ['./human-vs-machine.page.scss'],
})
export class HumanVsMachinePage implements OnInit {
  humanDays: number;
  machineDays: number;

  constructor() { }

  ngOnInit() {
  }
  public sugarcaneCutPriceManPowerBurned;
  public sugarcaneCutPriceManPowerFresh;
  public sugarcaneCutPriceCartPower;
  public sugarcaneGetPriceManPowerBurned;
  public sugarcaneGetPriceManPowerFresh;
  public sugarcaneGetPriceCartPower;
  public sugarcaneLoadPriceManPowerBurned;
  public sugarcaneLoadPriceManPowerFresh;
  public sugarcaneLoadPriceCartPower;
  public clearBurned;
  public totalPerTonManPowerBurned;
  public totalPerTonManPowerFresh;
  public totalPerTonCartPower;
  public cartPower;
  public manPowerBurned;
  public manPowerFresh;
  public numberManPower;
  public totalDayCartPower;
  public totalDayManPowerBurned;
  public totalDayManPowerFresh;
  public quantity;
  public totalPriceCartPower;
  public totalPriceManPowerBurned;
  public totalPriceManPowerFresh;
  public priceBurnedCart;
  public priceFreshCart;
  public showResult = false;
  calculateTotalPrice() {
    this.sugarcaneCutPriceManPowerBurned=100
    this.sugarcaneCutPriceManPowerFresh=100
    this.sugarcaneCutPriceCartPower=190
    
    this.sugarcaneGetPriceManPowerBurned=100
    this.sugarcaneGetPriceManPowerFresh=100
    this.sugarcaneGetPriceCartPower=0
    
    this.sugarcaneLoadPriceManPowerBurned=150
    this.sugarcaneLoadPriceManPowerFresh=150
    this.sugarcaneLoadPriceCartPower=150
    
    this.clearBurned=30
    

    this.totalPerTonManPowerBurned=this.sugarcaneCutPriceManPowerBurned+this.sugarcaneGetPriceManPowerBurned+this.sugarcaneLoadPriceManPowerBurned+this.clearBurned
    this.totalPerTonManPowerFresh=this.sugarcaneCutPriceManPowerFresh+this.sugarcaneGetPriceManPowerFresh+this.sugarcaneLoadPriceManPowerFresh
    this.totalPerTonCartPower=this.sugarcaneCutPriceCartPower+this.sugarcaneGetPriceCartPower+this.sugarcaneLoadPriceCartPower

    this.cartPower=400
    this.manPowerBurned=12
    this.manPowerFresh=4
    this.numberManPower=10
    
    this.totalDayCartPower = (this.quantity / this.cartPower)
    this.totalDayManPowerBurned = (this.quantity / this.numberManPower / this.manPowerBurned)
    this.totalDayManPowerFresh = (this.quantity / this.numberManPower / this.manPowerFresh)
    
    this.totalPriceCartPower = Math.floor(this.quantity * this.totalPerTonCartPower)
    this.totalPriceManPowerBurned = Math.floor(this.quantity * this.totalPerTonManPowerBurned)
    this.totalPriceManPowerFresh = Math.floor(this.quantity * this.totalPerTonManPowerFresh)

    this.priceBurnedCart=Math.floor(this.totalPriceManPowerBurned-this.totalPriceCartPower)
    this.priceFreshCart=Math.floor(this.totalPriceManPowerFresh-this.totalPriceCartPower)
    this.showResult=true;
    /*this.TotalPrice= {
        totalPriceCartPower: this.totalPriceCartPower,
        totalPriceManPowerBurned:this.totalPriceManPowerBurned,
        totalPriceManPowerFresh: this.totalPriceManPowerFresh
    }
    this.TotalDay= {
        totalDayCartPower: this.totalDayCartPower,
        totalDayManPowerBurned:this.totalDayManPowerBurned,
        totalDayManPowerFresh: this.totalDayManPowerFresh
    }
    this.TotalPriceDiff= {
        priceBurnedCart: this.priceBurnedCart,
        priceFreshCart:this.priceFreshCart,
    }

    this.ManPowerBurned={
        totalPriceManPowerBurned:this.totalPriceManPowerBurned,
        totalDayManPowerBurned:this.totalDayManPowerBurned
    }

    this.dataRet={
        totalDay:this.TotalDay,
        totalPrice: this.TotalPrice,
        totalPriceDiff: this.TotalPriceDiff
    }*/
    
  

    this.humanDays = 1000;
    this.machineDays = 90;
  }
}
