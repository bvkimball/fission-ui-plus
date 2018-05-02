import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-function-add',
  templateUrl: 'function-add.component.html',
})
export class FunctionAddComponent {
    environments = [
    {value: 'nodejs', label: 'NodeJS'},
    {value: 'workflow', label: 'Workflow'},
    {value: 'binary', label: 'Binary'}
    ];
  constructor(
    public dialogRef: MatDialogRef<FunctionAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
