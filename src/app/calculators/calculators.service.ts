import { Injectable } from '@angular/core';

export class ModernFarmCalcData {
  public sugarcaneArea = 1;
  public oldTotalCost = 4385;
  public modernTotalCost = 4160;
  public reduceCost: number;
  public totalIncrease: number;
  public increaeResultPerRai: number;
  public oldIncome = 9226;
  public modernIncome = 12726;
  public oldMoneyLeft = 4841;
  public modernMoneyLeft = 8566;
  public oldPrepareLandPlant = 250;
  public modernPrepareLandPlant = 250;
  public modernPrepareLandRipper = 450;
  public oldPrepareLandTaida = 400;
  public modernPrepareLandTaida = 400;
  public oldSugarcaneDoubleHead = 750;
  public modernSugarcaneDoubleHead = 750;
  public oldSugarcaneFertilise = 800;
  public modernSugarcaneFertilise = 800;
  public oldSugarcaneRoot = 1305;
  public modernSugarcaneRoot = 870;
  public oldMaintainFertiliser = 300;
  public modernMaintainFertiliser = 200;
  public oldMaintainWeedKill = 200;
  public modernMaintainWeedKill = 100;
  public oldHavestCut = 100;
  public modernHavestCut = 190;
  public oldHavestGet = 100;
  public oldHavestLoad = 150;
  public modernHavestLoad = 150;
  public oldHavestBurned = 30;
  public oldCCS = 13;
  public modernCCS = 13;
  public oldResultperRai = 13.0;
  public modernResultPerRai = 18.0;
}

export class MachineCalcData {
  public quantity: number;
  public totalPriceManPowerBurned: number;
  public totalPriceManPowerFresh: number;
  public totalPriceCartPower: number;
  public priceBurnedCart: number;
  public totalDayCartPower: number;
  public totalDayManPowerBurned: number;
  public totalDayManPowerFresh: number;
  public calsugarcaneCutPriceManPowerBurned: number;
  public calsugarcaneCutPriceManPowerFresh: number;
  public calsugarcaneCutPriceCartPower: number;
  public calsugarcaneGetPriceManPowerBurned: number;
  public calsugarcaneGetPriceManPowerFresh: number;
  public calsugarcaneGetPriceCartPower: number;
  public calsugarcaneLoadPriceManPowerBurned: number;
  public calsugarcaneLoadPriceManPowerFresh: number;
  public calsugarcaneLoadPriceCartPower: number;
  public calclearBurned: number;
  public totalPerTonManPowerBurned: number;
  public totalPerTonManPowerFresh: number;
  public totalPerTonCartPower: number;
  public clearBurned = 30;
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorsService {
  modernFarmCalcData: ModernFarmCalcData = new ModernFarmCalcData();
  modernFarmReport: ModernFarmCalcData = new ModernFarmCalcData();
  modernFarmReport1Rai: ModernFarmCalcData = new ModernFarmCalcData();
  machineCalcData: MachineCalcData;
  machineCalcReport1Rai: MachineCalcData;

  constructor() { }

  buildModernFarmReport(sugarcaneArea: number) {
    this.modernFarmReport.sugarcaneArea = sugarcaneArea;
    this.modernFarmReport.oldTotalCost = 4385 * sugarcaneArea;
    this.modernFarmReport.modernTotalCost = 4160 * sugarcaneArea;
    this.modernFarmReport.oldIncome = 9226 * sugarcaneArea;
    this.modernFarmReport.modernIncome = 12726 * sugarcaneArea;
    this.modernFarmReport.oldMoneyLeft = 4841 * sugarcaneArea;
    this.modernFarmReport.modernMoneyLeft = 8566 * sugarcaneArea;
    this.modernFarmReport.oldPrepareLandPlant = 250 * sugarcaneArea;
    this.modernFarmReport.modernPrepareLandPlant = 250 * sugarcaneArea;
    this.modernFarmReport.modernPrepareLandRipper = 450 * sugarcaneArea;
    this.modernFarmReport.oldPrepareLandTaida = 400 * sugarcaneArea;
    this.modernFarmReport.modernPrepareLandTaida = 400 * sugarcaneArea;
    this.modernFarmReport.oldSugarcaneDoubleHead = 750 * sugarcaneArea;
    this.modernFarmReport.modernSugarcaneDoubleHead = 750 * sugarcaneArea;
    this.modernFarmReport.oldSugarcaneFertilise = 800 * sugarcaneArea;
    this.modernFarmReport.modernSugarcaneFertilise = 800 * sugarcaneArea;
    this.modernFarmReport.oldSugarcaneRoot = 1305 * sugarcaneArea;
    this.modernFarmReport.modernSugarcaneRoot = 870 * sugarcaneArea;
    this.modernFarmReport.oldMaintainFertiliser = 300 * sugarcaneArea;
    this.modernFarmReport.modernMaintainFertiliser = 200 * sugarcaneArea;
    this.modernFarmReport.oldMaintainWeedKill = 200 * sugarcaneArea;
    this.modernFarmReport.modernMaintainWeedKill = 100 * sugarcaneArea;
    this.modernFarmReport.oldHavestCut = 100 * sugarcaneArea;
    this.modernFarmReport.modernHavestCut = 190 * sugarcaneArea;
    this.modernFarmReport.oldHavestGet = 100 * sugarcaneArea;
    this.modernFarmReport.oldHavestLoad = 150 * sugarcaneArea;
    this.modernFarmReport.modernHavestLoad = 150 * sugarcaneArea;
    this.modernFarmReport.oldHavestBurned = 30 * sugarcaneArea;
    return this.modernFarmReport;
  }

  calculateModernfarm(sugarcaneArea: number) {
    const SugarCanePrice = 700;
    const modernHavestGet = 0;
    const modernHavestBurned = 0;
    const oldPrepareLandRipper = 0;

    this.modernFarmCalcData.sugarcaneArea = sugarcaneArea;
    this.buildModernFarmReport(sugarcaneArea);
    const oldTotalCostCal = this.modernFarmCalcData.oldPrepareLandPlant + oldPrepareLandRipper +
      this.modernFarmCalcData.oldPrepareLandTaida + this.modernFarmCalcData.oldSugarcaneDoubleHead +
      this.modernFarmCalcData.oldSugarcaneFertilise + this.modernFarmCalcData.oldSugarcaneRoot +
      this.modernFarmCalcData.oldMaintainFertiliser + this.modernFarmCalcData.oldMaintainWeedKill +
      this.modernFarmCalcData.oldHavestCut + this.modernFarmCalcData.oldHavestGet + this.modernFarmCalcData.oldHavestLoad +
      this.modernFarmCalcData.oldHavestBurned;
    this.modernFarmCalcData.oldIncome = (this.modernFarmCalcData.oldResultperRai * SugarCanePrice) +
      ((this.modernFarmCalcData.oldCCS - 10) * SugarCanePrice * 6 / 100);
    const modernTotalCost = this.modernFarmCalcData.modernPrepareLandPlant + this.modernFarmCalcData.modernPrepareLandRipper +
      this.modernFarmCalcData.modernPrepareLandTaida + this.modernFarmCalcData.modernSugarcaneDoubleHead +
      this.modernFarmCalcData.modernSugarcaneFertilise + this.modernFarmCalcData.modernSugarcaneRoot +
      this.modernFarmCalcData.modernMaintainFertiliser + this.modernFarmCalcData.modernMaintainWeedKill +
      this.modernFarmCalcData.modernHavestCut + modernHavestGet + this.modernFarmCalcData.modernHavestLoad + modernHavestBurned;
    this.modernFarmCalcData.modernIncome = (this.modernFarmCalcData.modernResultPerRai * SugarCanePrice) +
      ((this.modernFarmCalcData.modernCCS - 10) * SugarCanePrice * 6 / 100);
    this.modernFarmCalcData.oldTotalCost = Math.ceil(this.modernFarmCalcData.sugarcaneArea * oldTotalCostCal);
    this.modernFarmCalcData.modernTotalCost = Math.ceil(this.modernFarmCalcData.sugarcaneArea * modernTotalCost);
    this.modernFarmCalcData.reduceCost = Math.floor(this.modernFarmCalcData.oldTotalCost - this.modernFarmCalcData.modernTotalCost);
    this.modernFarmCalcData.increaeResultPerRai = Math.floor(this.modernFarmCalcData.sugarcaneArea *
      (this.modernFarmCalcData.modernResultPerRai - this.modernFarmCalcData.oldResultperRai));
    const increaseIncomeByArea = Math.floor(this.modernFarmCalcData.sugarcaneArea * (this.modernFarmCalcData.modernIncome -
      this.modernFarmCalcData.oldIncome));
    this.modernFarmCalcData.totalIncrease = Math.floor(this.modernFarmCalcData.reduceCost + increaseIncomeByArea);
    return this.modernFarmCalcData;
  }

  calculateMachine(quantity: number) {
    const sugarcaneCutPriceManPowerBurned = 100;
    const sugarcaneCutPriceManPowerFresh = 100;
    const sugarcaneCutPriceCartPower = 190;
    const sugarcaneGetPriceManPowerBurned = 100;
    const sugarcaneGetPriceManPowerFresh = 100;
    const sugarcaneGetPriceCartPower = 0;
    const sugarcaneLoadPriceManPowerBurned = 150;
    const sugarcaneLoadPriceManPowerFresh = 150;
    const sugarcaneLoadPriceCartPower = 150;
    const cartPower = 400;
    const manPowerBurned = 12;
    const manPowerFresh = 4;
    const numberManPower = 10;

    this.machineCalcData = new MachineCalcData();
    this.machineCalcData.quantity = quantity;
    this.machineCalcData.totalPerTonManPowerBurned = sugarcaneCutPriceManPowerBurned + sugarcaneGetPriceManPowerBurned +
      sugarcaneLoadPriceManPowerBurned + this.machineCalcData.clearBurned;
    this.machineCalcData.totalPerTonManPowerFresh = sugarcaneCutPriceManPowerFresh + sugarcaneGetPriceManPowerFresh +
      sugarcaneLoadPriceManPowerFresh;
    this.machineCalcData.totalPerTonCartPower = sugarcaneCutPriceCartPower + sugarcaneGetPriceCartPower + sugarcaneLoadPriceCartPower;
    this.machineCalcData.totalDayCartPower = Math.ceil(this.machineCalcData.quantity / cartPower);
    this.machineCalcData.totalDayManPowerBurned = Math.ceil(this.machineCalcData.quantity / numberManPower / manPowerBurned);
    this.machineCalcData.totalDayManPowerFresh = Math.ceil(this.machineCalcData.quantity / numberManPower / manPowerFresh);
    this.machineCalcData.totalPriceCartPower = Math.floor(this.machineCalcData.quantity * this.machineCalcData.totalPerTonCartPower);
    this.machineCalcData.totalPriceManPowerBurned = Math.floor(this.machineCalcData.quantity *
      this.machineCalcData.totalPerTonManPowerBurned);
    this.machineCalcData.totalPriceManPowerFresh = Math.floor(this.machineCalcData.quantity *
      this.machineCalcData.totalPerTonManPowerFresh);
    this.machineCalcData.priceBurnedCart = Math.floor(this.machineCalcData.totalPriceManPowerBurned -
      this.machineCalcData.totalPriceCartPower);
    this.machineCalcData.calsugarcaneCutPriceManPowerBurned = this.machineCalcData.quantity * sugarcaneCutPriceManPowerBurned;
    this.machineCalcData.calsugarcaneCutPriceManPowerFresh = this.machineCalcData.quantity * sugarcaneCutPriceManPowerFresh;
    this.machineCalcData.calsugarcaneCutPriceCartPower = this.machineCalcData.quantity * sugarcaneCutPriceCartPower;
    this.machineCalcData.calsugarcaneGetPriceManPowerBurned = this.machineCalcData.quantity * sugarcaneGetPriceManPowerBurned;
    this.machineCalcData.calsugarcaneGetPriceManPowerFresh = this.machineCalcData.quantity * sugarcaneGetPriceManPowerFresh;
    this.machineCalcData.calsugarcaneGetPriceCartPower = this.machineCalcData.quantity * sugarcaneGetPriceCartPower;
    this.machineCalcData.calsugarcaneLoadPriceManPowerBurned = this.machineCalcData.quantity * sugarcaneLoadPriceManPowerBurned;
    this.machineCalcData.calsugarcaneLoadPriceManPowerFresh = this.machineCalcData.quantity * sugarcaneLoadPriceManPowerFresh;
    this.machineCalcData.calsugarcaneLoadPriceCartPower = this.machineCalcData.quantity * sugarcaneLoadPriceCartPower;
    this.machineCalcData.calclearBurned = this.machineCalcData.quantity * this.machineCalcData.clearBurned;
    this.machineCalcData.totalPerTonManPowerBurned = this.machineCalcData.totalPerTonManPowerBurned * this.machineCalcData.quantity;
    this.machineCalcData.totalPerTonManPowerFresh = this.machineCalcData.totalPerTonManPowerFresh * this.machineCalcData.quantity;
    this.machineCalcData.totalPerTonCartPower = this.machineCalcData.totalPerTonCartPower * this.machineCalcData.quantity;
    return this.machineCalcData;
  }
}
