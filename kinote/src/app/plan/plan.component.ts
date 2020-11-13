import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Planned, Proposal } from '../shared/planned';
import { FilmService } from '../services/film.service';
import { animation } from '@angular/animations';
import { dissolve } from '../animations/app.animations';
import { Movie } from '../shared/movie';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
  animations: [
    dissolve()
  ]
})
export class PlanComponent implements OnInit {

  planForm: FormGroup;
  movie: Movie;
  plan: Planned;
  @ViewChild('fform') planFormDirective;  
  imdbResult: Movie[];
  imdbSearchCompleted: boolean;
  fromDay: Date;
  toDay: Date;
  fromHour: string;
  toHour: string;
  loadingStep: number;

  formErrors = {
    'title': '',
    'runningTimeInMinutes': '',
    'director': ''
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
    this.loadingStep = 0;
  }

  createForm() {
    this.planForm = this.fb.group({
      title: ['', Validators.required],
      runningTimeInMinutes: 0,
      director: ''
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

  onSelectSearchedMovie(id: string, cast: string = null) {
    let index = id.indexOf('/', 1);
    id = id.substr(index);
    id = id.replace('/', '');
    id = id.replace('/', '');
    this.loadingStep = 2;
    console.log(id);
    this.filmService.getShowDetails(id)
    .subscribe((result) => {      
      this.planForm.patchValue({
        title: result.title,
        runningTimeInMinutes: result.runningTimeInMinutes,
      });
      this.loadingStep --;
    });
    this.filmService.getShowDirector(id)
    .subscribe((result) => {      
      this.planForm.patchValue({
        director: result.director,        
      });
      this.loadingStep --;
    });
  }

  onSubmitSearch(): void {    
    this.filmService.searchShow(this.planForm.value.title)
    .subscribe((result) => {this.imdbResult = result; this.loadingStep = this.imdbResult.length > 1 ? 1 : 0});        
  }

  onSubmit(): void {
    this.plan = this.planForm.value;

    this.filmService.submitPlan(this.plan)
    .subscribe((plan) => {
      this.plan = plan;      
    })

    this.planFormDirective.resetForm({
      title: '',
      runningTimeInMinutes: 0,
      director: ''
    });
  }
}
