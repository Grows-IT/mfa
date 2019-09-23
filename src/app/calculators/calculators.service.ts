import { Injectable } from '@angular/core';

export class FarmModernFarmData {
  public landSize = 1;
  public prepareCost1 = 250;
  public moderFarmPrepareCost2 = 450;
  public prepareCost3 = 400;
  public plantCost1 = 750;
  public plantCost2 = 800;
  public plantCost3 = 1305;
  public modernFarmPlantCost3 = 870;
  public maintenanceCost1 = 300;
  public modernFarmMaintenanceCost2 = 200;
  public maintenanceCost3 = 200;
  public modernFarmMaintenanceCost4 = 100;
  public harvestCost = 100;
  public modernFarmHarvestCost = 190;
  public harvestCost3 = 150;
  public harvestCost4 = 30;
  public totalExpense = 4385;
  public modernFarmTotalExpense = 4160;
  public totalWeight = 13;
  public modernFarmTotalWeight = 18;
  public ccs = 13;
  public totalIncome = 9226;
  public modernFarmTotalIncome = 12726;
  public totalProfit = 4841;
  public modernFarmTotalProfit = 8566;
}

export class HumanMachineData {
  public sugarcaneWeight = 1;
  public laborCost = 100;
  public transportCost = 150;
  public burnedSugarCost = 30;
  public burnedSugarTotalCost = 380;
  public freshSugarTotalCost = 350;
  public machineCutCost = 190;
  public machineTotalCost = 340;
  public machineCutTonnePerDay = 400;
  public burnedSugarCutTonnePerDay = 7;
  public freshSugarTonnePerDay = 4;
  public machineCutTime = this.sugarcaneWeight / this.machineCutTonnePerDay;
  public burnedSugarCutTime = this.sugarcaneWeight / this.burnedSugarCutTonnePerDay;
  public freshSugarCutTime = this.sugarcaneWeight / this.freshSugarTonnePerDay;
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorsService {
  farmModernFarmData: FarmModernFarmData;
  farmModernFarmData1Rai = new FarmModernFarmData();
  humanMachineData: HumanMachineData;
  humanMachineData1Rai = new HumanMachineData();

  constructor() { }

  calculateFarmModernFarm(landSize: number) {
    this.farmModernFarmData = new FarmModernFarmData();
    this.farmModernFarmData.landSize *= landSize;
    this.farmModernFarmData.prepareCost1 *= landSize;
    this.farmModernFarmData.moderFarmPrepareCost2 *= landSize;
    this.farmModernFarmData.prepareCost3 *= landSize;
    this.farmModernFarmData.plantCost1 *= landSize;
    this.farmModernFarmData.plantCost2 *= landSize;
    this.farmModernFarmData.plantCost3 *= landSize;
    this.farmModernFarmData.modernFarmPlantCost3 *= landSize;
    this.farmModernFarmData.maintenanceCost1 *= landSize;
    this.farmModernFarmData.modernFarmMaintenanceCost2 *= landSize;
    this.farmModernFarmData.maintenanceCost3 *= landSize;
    this.farmModernFarmData.modernFarmMaintenanceCost4 *= landSize;
    this.farmModernFarmData.harvestCost *= landSize;
    this.farmModernFarmData.modernFarmHarvestCost *= landSize;
    this.farmModernFarmData.harvestCost3 *= landSize;
    this.farmModernFarmData.harvestCost4 *= landSize;
    this.farmModernFarmData.totalExpense *= landSize;
    this.farmModernFarmData.modernFarmTotalExpense *= landSize;
    this.farmModernFarmData.totalIncome *= landSize;
    this.farmModernFarmData.modernFarmTotalIncome *= landSize;
    this.farmModernFarmData.totalProfit *= landSize;
    this.farmModernFarmData.modernFarmTotalProfit *= landSize;
    return this.farmModernFarmData;
  }

  calculateHumanMachine(sugarcaneWeight: number) {
    this.humanMachineData = new HumanMachineData();
    this.humanMachineData.sugarcaneWeight *= sugarcaneWeight;
    this.humanMachineData.laborCost *= sugarcaneWeight;
    this.humanMachineData.transportCost *= sugarcaneWeight;
    this.humanMachineData.burnedSugarCost *= sugarcaneWeight;
    this.humanMachineData.burnedSugarTotalCost *= sugarcaneWeight;
    this.humanMachineData.freshSugarTotalCost *= sugarcaneWeight;
    this.humanMachineData.machineCutCost *= sugarcaneWeight;
    this.humanMachineData.machineTotalCost *= sugarcaneWeight;
    this.humanMachineData.machineCutTime *= sugarcaneWeight;
    this.humanMachineData.burnedSugarCutTime *= sugarcaneWeight;
    this.humanMachineData.freshSugarCutTime *= sugarcaneWeight;
    if (this.humanMachineData.machineCutTime < 1) {
      this.humanMachineData.machineCutTime = 1;
    }
    if (this.humanMachineData.burnedSugarCutTime < 1) {
      this.humanMachineData.burnedSugarCutTime = 1;
    }
    if (this.humanMachineData.freshSugarCutTime < 1) {
      this.humanMachineData.freshSugarCutTime = 1;
    }
    return this.humanMachineData;
  }
}
