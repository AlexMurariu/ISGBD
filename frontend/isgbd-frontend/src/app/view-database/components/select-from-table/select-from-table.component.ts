import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { TableModel, AttributeModel } from 'src/app/shared/models';
import { ConditionSigns } from 'src/app/shared/constants';

interface DialogData {
  tablesList: TableModel[];
  selectRecordsCallback: any;
}

@Component({
  selector: 'app-select-from-table',
  templateUrl: './select-from-table.component.html',
  styleUrls: ['./select-from-table.component.scss']
})
export class SelectFromTableComponent implements OnInit {
  selectRecordsForm: FormGroup;
  checkedAttributes: {attribute: string, isChecked: boolean}[] = [];
  distinct: boolean = false;
  conditions = ['gt', 'gte', 'lt', 'lte', 'eq', 'neq'];
  conditionsList: {attributeName: string, condition: string, value: string}[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<SelectFromTableComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    this.selectRecordsForm = this.fb.group({
      tableName: ['', [Validators.required]],
      attribute: '',
      condition: '',
      value: ''
    });

    this.subscriptions.push(
      this.tableNameControl.valueChanges.subscribe(() => {
        this.setAttributesList();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  get tableNameControl() {
    return this.selectRecordsForm.get('tableName');
  }

  get attributeControl() {
    return this.selectRecordsForm.get('attribute');
  }

  get conditionControl() {
    return this.selectRecordsForm.get('condition');
  }

  get valueControl() {
    return this.selectRecordsForm.get('value');
  }

  get disableSelectAllOption() {
    let disable = false;

    if (!this.checkedAttributes.length) {
      return disable;
    }

    this.checkedAttributes.forEach((attribute: {attribute: string, isChecked: boolean}) => {
      if (attribute.attribute !== "*" && attribute.isChecked) {
        disable = true;
      }
    });

    return disable;
  }

  get disableOtherOptions() {
    let disable = false;

    if (!this.checkedAttributes.length) {
      return disable;
    }

    this.checkedAttributes.forEach((attribute: {attribute: string, isChecked: boolean}) => {
      if (attribute.attribute === "*") {
        disable = attribute.isChecked;
      }
    });

    return disable;
  }
  
  get isAttributeSelected() {
    let isSelected = false;

    if (!this.checkedAttributes.length) {
      return isSelected;
    }

    this.checkedAttributes.forEach((attribute: {attribute: string, isChecked: boolean}) => {
      if (attribute.isChecked) {
        isSelected = true;
      }
    });

    return isSelected;
  }

  displayAndSign(index: number) {
    if (this.conditionsList.length) {
      return index === this.conditionsList.length - 1 ? '' : 'AND';
    }

    return '';
  }

  removeCondition(index: number) {
    this.conditionsList.splice(index, 1);
  }

  getSelectedTable(tableName: string) {
    return this.data.tablesList.find((table: TableModel) => table.tableName === tableName);
  }

  getConditionSign(sign: string) {
    return ConditionSigns[sign];
  }

  setAttributesList() {
    const table = this.getSelectedTable(this.tableNameControl.value);

    if (!table) {
      return;
    }

    this.checkedAttributes.length = 0;

    this.checkedAttributes.push({
      attribute: '*',
      isChecked: false
    });

    const attributes = table.attributes.map((attribute: AttributeModel) => {
      return {
        attribute: attribute.attributeName,
        isChecked: false
      }
    });

    this.checkedAttributes = this.checkedAttributes.concat(attributes);
  }

  selectAttributes(value: any) {
    this.checkedAttributes = this.checkedAttributes.map((checkedAttribute: { attribute: string, isChecked: boolean }) => {
      if (checkedAttribute.attribute === value.source.value) {
        checkedAttribute.isChecked = value.checked;
      }

      return checkedAttribute;
    });
  }

  selectDistinct(value: any) {
    this.distinct = value.checked;
  }

  addCondition() {
    if (!this.attributeControl.value || !this.conditionControl.value || !this.valueControl.value) {
      return;
    }

    this.conditionsList.push({
      attributeName: this.attributeControl.value,
      condition: this.conditionControl.value,
      value: this.valueControl.value
    });

    this.attributeControl.reset();
    this.conditionControl.reset();
    this.valueControl.reset();
  }

  cancel() {
    this.dialogRef.close(true);
  }

  select() {
    const checkedAttributes = this.checkedAttributes
      .filter((attr: {attribute: string, isChecked: boolean}) => attr.isChecked)
      .map((attr: {attribute: string, isChecked: boolean}) => {
        if (attr.isChecked) {
          return attr.attribute;
        }
      });

    const data = {
      tableName: this.tableNameControl.value,
      attributes: checkedAttributes,
      conditions: this.conditionsList,
      distinct: this.distinct
    }

    this.data.selectRecordsCallback(data)
  }
}
