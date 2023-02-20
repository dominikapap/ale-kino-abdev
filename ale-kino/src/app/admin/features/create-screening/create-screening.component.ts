import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf, UpperCasePipe, AsyncPipe, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-create-screening',
  templateUrl: './create-screening.component.html',
  styleUrls: ['./create-screening.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    NgIf,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatButtonModule,
    UpperCasePipe,
    MatChipsModule,
    MatAutocompleteModule,
    AsyncPipe,
    NgFor,
  ],
})
export default class CreateScreeningComponent {
  private builder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  screeningForm = this.createForm();
  isError: boolean = false;

  @ViewChild('imageButton') imageButton!: ElementRef<HTMLButtonElement>;

  tagList: string[] = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];

  fileName = '';

  onTagRemoved(tag: string) {
    const tags = this.tagsCtrl.value as string[];
    this.removeFirst(tags, tag);
    this.tagsCtrl.setValue(tags); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  private createForm() {
    const form = this.builder.group({
      title: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
          Validators.maxLength(100),
        ],
      }),
      description: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
          Validators.maxLength(3000),
        ],
      }),
      tags: this.builder.control<string[]>([], {
        validators: [Validators.required],
      }),
      rated: this.builder.control('', {
        validators: [Validators.required],
      }),
      length: this.builder.control('', {
        validators: [Validators.required],
      }),
      dateTime: this.builder.control('', {
        validators: [Validators.required],
      }),
      image: this.builder.control<File | null>(null),
    });

    return form;
  }

  sendForm() {
    this.screeningForm.markAllAsTouched();
    if (this.screeningForm.invalid) {
      console.log('invalid');
      return;
    }

    // handle...
    console.log(this.screeningForm.value);
    if (this.screeningForm.valid) {
      // this.router.navigate(['/summary']);
    }
  }

  get titleCtrl() {
    return this.screeningForm.controls.title;
  }
  get descriptionCtrl() {
    return this.screeningForm.controls.description;
  }
  get tagsCtrl() {
    return this.screeningForm.controls.tags;
  }
  get ratedCtrl() {
    return this.screeningForm.controls.rated;
  }
  get lengthCtrl() {
    return this.screeningForm.controls.length;
  }
  get dateTimeCtrl() {
    return this.screeningForm.controls.dateTime;
  }
  get imageCtrl() {
    return this.screeningForm.controls.image;
  }

  setLogoFileToForm(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileName = file.name;
    }
  }
}
