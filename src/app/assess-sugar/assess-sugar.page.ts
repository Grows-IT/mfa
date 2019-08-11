import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assess-sugar',
  templateUrl: './assess-sugar.page.html',
  styleUrls: ['./assess-sugar.page.scss'],
})
export class AssessSugarPage implements OnInit {
  totalWeightAll: number;
  totalOutput: number;
  area: number;
  caneBlock: number;
  gap: number;
  areaWidth: number;
  showResult = false;
  inputs = [{
    id: '1',
    name: 'พื้นที่ชาวไร่',
    unit: 'ไร่',
    value: null
  }, {
    id: '2',
    name: 'ความกว้างของพื้นที่',
    unit: 'เมตร',
    value: null
  }, {
    id: '3',
    name: 'ความยาวของพื้นที่',
    unit: 'เมตร',
    value: null
  }, {
    id: '4',
    name: 'ระยะร่องปลูก',
    unit: 'เมตร',
    value: null
  }, {
    id: '5',
    name: 'จำนวนหน่ออ้อย',
    unit: 'หน่อ',
    value: null
  }]

  constructor() { }

  ngOnInit() {
  }

  calculateTotalWeight() {
    this.area = this.inputs[0].value;
    this.areaWidth = this.inputs[1].value;
    this.gap = this.inputs[3].value;
    this.caneBlock = this.inputs[4].value;

    const areaLenght = this.area * 1600 / this.areaWidth
    const totalGap = this.areaWidth / this.gap
    const totalCaneBlock = areaLenght * totalGap * (12 * this.caneBlock)

    const totalWeight = totalCaneBlock * 0.002
    this.totalOutput = totalWeight / this.area
    this.totalWeightAll = Math.floor(this.area * 1600 / this.areaWidth * this.areaWidth / this.gap * this.caneBlock * 0.002)
    this.totalOutput = Math.floor(this.area * 1600 / this.areaWidth * this.areaWidth / this.gap * this.caneBlock * 0.002 / this.area)
    this.showResult = true;
  }
}
