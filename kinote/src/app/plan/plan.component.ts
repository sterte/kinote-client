import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Planned, Proposal } from '../shared/planned';
import { FilmService } from '../services/film.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {

  planForm: FormGroup;
  plan: Planned;
  @ViewChild('fform') planFormDirective;  
  fromDay: Date;
  toDay: Date;
  fromHour: string;
  toHour: string;

  formErrors = {
    'title': '',
  };

  validationMessages = {
    'title': {
      'required': 'Title is required.'      
    },    
  };

  constructor(
    private fb: FormBuilder,
    private filmService: FilmService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.planForm = this.fb.group({
      title: ['', Validators.required],
      proposals: [[]],
      fromDay: null,
      toDay: null,
      fromHour: null,
      toHour: null,
    });

    this.planForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.planForm) {
      return;
    }
    const form = this.planForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  addDateRange(): void {    
    this.plan = this.planForm.value;
    let el = {fromDay: this.fromDay, 'toDay': this.toDay, fromHour: '', toHour:''}
    console.log(el);
    this.plan.proposals.push(el);
    this.fromDay = null;
    this.toDay = null;
    this.fromHour = null;
    this.toHour = null;
    console.log(JSON.stringify(this.plan));
  }

  onSubmit(): void {
    this.plan = this.planForm.value;

    this.filmService.submitPlan(this.plan)
    .subscribe((plan) => {
      this.plan = plan;      
    })

    this.planFormDirective.resetForm({
      title: '',
      proposals: []
    });
  }
}
