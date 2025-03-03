import { Component, EventEmitter, OnInit, Output, Input, AfterViewInit, SimpleChanges , ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import Cropper from 'cropperjs';
import {Rezept} from "../../../../models/rezepte";
import { ActivatedRoute } from '@angular/router';
import {Router} from "@angular/router";
import {RezeptService} from "../../../../services/rezepte.service";

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html'
})

export class CropperComponent {

/*  @Output() closeOverlay = new EventEmitter<void>();

  onClose() {
    this.closeOverlay.emit();
  }*/

}
