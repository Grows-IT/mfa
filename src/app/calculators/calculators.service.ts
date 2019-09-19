import { Injectable } from '@angular/core';

export interface ModernFarmCalcData {
  sugarcaneArea: number;
  oldTotalCost: number;
  modernTotalCost: number;
  reduceCost: number;
  totalIncrease: number;
  increaeResultPerRai: number;
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorsService {
  modernFarmCalcData: ModernFarmCalcData = {} as any;

  constructor() {}

  modernFarmCalc(sugarcaneArea: number) {
    this.modernFarmCalcData.sugarcaneArea = sugarcaneArea;

    const SugarCanePrice = 700;

    const oldPrepareLandPlant = 250;
    const oldPrepareLandRipper = 0;
    const oldPrepareLandTaida = 400;
    const oldSugarcaneDoubleHead = 750;
    const oldSugarcaneFertilise = 800;
    const oldSugarcaneRoot = 1305;
    const oldMaintainFertiliser = 300;
    const oldMaintainWeedKill = 200;
    const oldHavestCut = 100;
    const oldHavestGet = 100;
    const oldHavestLoad = 150;
    const oldHavestBurned = 30;
    const oldTotalCostCal = oldPrepareLandPlant + oldPrepareLandRipper + oldPrepareLandTaida +
      oldSugarcaneDoubleHead + oldSugarcaneFertilise + oldSugarcaneRoot + oldMaintainFertiliser +
      oldMaintainWeedKill + oldHavestCut + oldHavestGet + oldHavestLoad + oldHavestBurned;

    const oldResultperRai = 13;
    const oldCCS = 13;
    const oldIncome = (oldResultperRai * SugarCanePrice) + ((oldCCS - 10) * SugarCanePrice * 6 / 100);

    const modernPrepareLandPlant = 250;
    const modernPrepareLandRipper = 450;
    const modernPrepareLandTaida = 400;
    const modernSugarcaneDoubleHead = 750;
    const modernSugarcaneFertilise = 800;
    const modernSugarcaneRoot = 870;
    const modernMaintainFertiliser = 200;
    const modernMaintainWeedKill = 100;
    const modernHavestCut = 190;
    const modernHavestGet = 0;
    const modernHavestLoad = 150;
    const modernHavestBurned = 0;
    const modernTotalCost = modernPrepareLandPlant + modernPrepareLandRipper + modernPrepareLandTaida +
      modernSugarcaneDoubleHead + modernSugarcaneFertilise + modernSugarcaneRoot + modernMaintainFertiliser +
      modernMaintainWeedKill + modernHavestCut + modernHavestGet + modernHavestLoad + modernHavestBurned;

    const modernResultPerRai = 18;
    const modernCCS = 13;
    const modernIncome = (modernResultPerRai * SugarCanePrice) + ((modernCCS - 10) * SugarCanePrice * 6 / 100);
    this.modernFarmCalcData.oldTotalCost = Math.ceil(this.modernFarmCalcData.sugarcaneArea * oldTotalCostCal);
    this.modernFarmCalcData.modernTotalCost = Math.ceil(this.modernFarmCalcData.sugarcaneArea * modernTotalCost);
    this.modernFarmCalcData.reduceCost = Math.floor(this.modernFarmCalcData.oldTotalCost - this.modernFarmCalcData.modernTotalCost);
    this.modernFarmCalcData.increaeResultPerRai = Math.floor(this.modernFarmCalcData.sugarcaneArea *
                                                  (modernResultPerRai - oldResultperRai));
    const increaseIncomeByArea = Math.floor(this.modernFarmCalcData.sugarcaneArea * (modernIncome - oldIncome));
    this.modernFarmCalcData.totalIncrease = Math.floor(this.modernFarmCalcData.reduceCost + increaseIncomeByArea);
    return this.modernFarmCalcData;
  }
}
