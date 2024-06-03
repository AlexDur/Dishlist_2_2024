import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Output() confirm = new EventEmitter<boolean>();
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() message: string = '';
  @Input() visible: boolean = false;

  showDialog() {
    this.visible = true;
    this.visibleChange.emit(this.visible);
  }

  // Aufruf, um den Dialog zu verstecken
  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onConfirm() {
    this.confirm.emit(true);
    this.hideDialog();
  }

  onDecline() {
    this.confirm.emit(false);
    this.hideDialog();
  }

}
