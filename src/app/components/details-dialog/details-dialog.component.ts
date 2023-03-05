import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent {
  public dataSource: any;
  public fieldsConfig: FieldsConfig[];
  constructor(@Inject(MAT_DIALOG_DATA) private data: { dataSource: any, config: FieldsConfig[] }) {
    this.dataSource = data.dataSource;
    this.fieldsConfig = data.config;
  }
}

export interface FieldsConfig {
  label: string;
  fieldName: string;
  type?: string;
}
