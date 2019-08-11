import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-human-vs-machine',
  templateUrl: './human-vs-machine.page.html',
  styleUrls: ['./human-vs-machine.page.scss'],
})
export class HumanVsMachinePage implements OnInit {
  quantity: number;
  totalPriceManPowerBurned: number;
  totalPriceCartPower: number;
  priceBurnedCart: number;
  totalDayCartPower: number;
  totalDayManPowerBurned: number;
  showResult = false;

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

    this.totalDayCartPower = (this.quantity / cartPower)
    this.totalDayManPowerBurned = Math.ceil(this.quantity / numberManPower / manPowerBurned)
    const totalDayManPowerFresh = (this.quantity / numberManPower / manPowerFresh)

    this.totalPriceCartPower = Math.floor(this.quantity * totalPerTonCartPower)
    this.totalPriceManPowerBurned = Math.floor(this.quantity * totalPerTonManPowerBurned)
    const totalPriceManPowerFresh = Math.floor(this.quantity * totalPerTonManPowerFresh)

    this.priceBurnedCart = Math.floor(this.totalPriceManPowerBurned - this.totalPriceCartPower)
    const priceFreshCart = Math.floor(totalPriceManPowerFresh - this.totalPriceCartPower)
    this.showResult = true;
  }

}
