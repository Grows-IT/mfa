import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-human-vs-machine',
  templateUrl: './human-vs-machine.page.html',
  styleUrls: ['./human-vs-machine.page.scss'],
})
export class HumanVsMachinePage implements OnInit {
  quantity: number;
  totalPriceManPowerBurned: number;
  totalPriceManPowerFresh: number;
  totalPriceCartPower: number;
  priceBurnedCart: number;
  totalDayCartPower: number;
  totalDayManPowerBurned: number;
  totalDayManPowerFresh: number;
  showResult = false;

  calsugarcaneCutPriceManPowerBurned: number;
  calsugarcaneCutPriceManPowerFresh: number;
  calsugarcaneCutPriceCartPower: number;
  calsugarcaneGetPriceManPowerBurned: number;
  calsugarcaneGetPriceManPowerFresh: number;
  calsugarcaneGetPriceCartPower: number;
  calsugarcaneLoadPriceManPowerBurned: number;
  calsugarcaneLoadPriceManPowerFresh: number;
  calsugarcaneLoadPriceCartPower: number;
  calclearBurned: number;

  constructor() { }

  ngOnInit() {
  }
  calculateTotalPrice() {
    const sugarcaneCutPriceManPowerBurned = 100
    const sugarcaneCutPriceManPowerFresh = 100
    const sugarcaneCutPriceCartPower = 190

    const sugarcaneGetPriceManPowerBurned = 100
    const sugarcaneGetPriceManPowerFresh = 100
    const sugarcaneGetPriceCartPower = 0

    const sugarcaneLoadPriceManPowerBurned = 150
    const sugarcaneLoadPriceManPowerFresh = 150
    const sugarcaneLoadPriceCartPower = 150

    const clearBurned = 30

    const totalPerTonManPowerBurned = sugarcaneCutPriceManPowerBurned + sugarcaneGetPriceManPowerBurned + sugarcaneLoadPriceManPowerBurned + clearBurned
    const totalPerTonManPowerFresh = sugarcaneCutPriceManPowerFresh + sugarcaneGetPriceManPowerFresh + sugarcaneLoadPriceManPowerFresh
    const totalPerTonCartPower = sugarcaneCutPriceCartPower + sugarcaneGetPriceCartPower + sugarcaneLoadPriceCartPower

    const cartPower = 400
    const manPowerBurned = 12
    const manPowerFresh = 4
    const numberManPower = 10

    this.totalDayCartPower = Math.ceil(this.quantity / cartPower)
    this.totalDayManPowerBurned = Math.ceil(this.quantity / numberManPower / manPowerBurned)
    this.totalDayManPowerFresh = Math.ceil(this.quantity / numberManPower / manPowerFresh)

    this.totalPriceCartPower = Math.floor(this.quantity * totalPerTonCartPower)
    this.totalPriceManPowerBurned = Math.floor(this.quantity * totalPerTonManPowerBurned)
    this.totalPriceManPowerFresh = Math.floor(this.quantity * totalPerTonManPowerFresh)

    this.priceBurnedCart = Math.floor(this.totalPriceManPowerBurned - this.totalPriceCartPower)
    //this.priceFreshCart = Math.floor(totalPriceManPowerFresh - this.totalPriceCartPower)
    this.showResult = true;

    this.calsugarcaneCutPriceManPowerBurned=this.quantity*sugarcaneCutPriceManPowerBurned;
    this.calsugarcaneCutPriceManPowerFresh=this.quantity*sugarcaneCutPriceManPowerFresh;
    this.calsugarcaneCutPriceCartPower=this.quantity*sugarcaneCutPriceCartPower;
    this.calsugarcaneGetPriceManPowerBurned=this.quantity*sugarcaneGetPriceManPowerBurned;;
    this.calsugarcaneGetPriceManPowerFresh=this.quantity*sugarcaneGetPriceManPowerFresh;
    this.calsugarcaneGetPriceCartPower=this.quantity*sugarcaneGetPriceCartPower;
    this.calsugarcaneLoadPriceManPowerBurned=this.quantity*sugarcaneLoadPriceManPowerBurned;
    this.calsugarcaneLoadPriceManPowerFresh=this.quantity*sugarcaneLoadPriceManPowerFresh;
    this.calsugarcaneLoadPriceCartPower=this.quantity*sugarcaneLoadPriceCartPower;
    this.calclearBurned=this.quantity*clearBurned;
  

  }
}
