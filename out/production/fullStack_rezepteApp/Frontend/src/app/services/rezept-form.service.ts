/*
// rezept-form.service.ts
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rezept } from '../models/rezepte';

@Injectable({
  providedIn: 'root',
})
export class RezeptFormService {
  constructor(private fb: FormBuilder) {}

  createForm(rezept?: Rezept): FormGroup {
    const form = this.fb.group({
      name: [rezept?.name || '', [Validators.required]],
      onlineAdresse: [rezept?.onlineAdresse || '', [Validators.required]],
      tags: [rezept?.tags || []],
      image: [rezept?.image || null],
    });
    return form;
  }

  updateForm(form: FormGroup, rezept: Rezept) {
    form.patchValue({
      name: rezept.name || '',
      onlineAdresse: rezept.onlineAdresse || '',
      tags: rezept.tags || [],
    });
  }

}
*/
