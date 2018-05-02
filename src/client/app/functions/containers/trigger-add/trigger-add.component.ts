import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-trigger-add',
  templateUrl: 'trigger-add.component.html'
})
export class TriggerAddComponent {
  public methods: any[] = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' }
  ];
  constructor(
    public dialogRef: MatDialogRef<TriggerAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
