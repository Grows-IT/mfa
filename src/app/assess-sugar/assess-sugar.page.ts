import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-assess-sugar',
  templateUrl: './assess-sugar.page.html',
  styleUrls: ['./assess-sugar.page.scss'],
})
export class AssessSugarPage implements OnInit {
  inputForm: FormGroup;
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
  // }, {
  //   id: '3',
  //   name: 'ความยาวของพื้นที่',
  //   unit: 'เมตร',
  //   value: null
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

  constructor(
    private formBuilder: FormBuilder,
  ) { 
    this.inputForm = this.formBuilder.group({
      area: ['', Validators.min(1)],
      areaWidth: ['', Validators.min(1)],
      gap: ['', Validators.min(1)],
      caneBlock: ['', Validators.min(1)],
    });
  }

  ngOnInit() {
  }

  calculateTotalWeight(data) {
    if (data.area <= 0 || data.areaWidth <= 0 || data.gap <= 0 || data.caneBlock <= 0) return;
    this.area = data.area;
    this.areaWidth = data.areaWidth
    this.gap = data.gap;
    this.caneBlock = data.caneBlock;

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
