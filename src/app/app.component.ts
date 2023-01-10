import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class AppComponent implements OnInit {
  title = 'tema4';
  loginForm!: FormGroup;
  showServerError!: boolean;
  private readonly serverUrl = 'https://reqres.in/api';
  constructor(private formbuilder:FormBuilder, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm(): void {
    this.loginForm = this.formbuilder.group({
      name:[null, [Validators.required,this.forbiddenNameValidator(/suicide/)]],
      email:[null, [Validators.required, Validators.email]],
      tel:[null, [Validators.required]],
      password:[null, [Validators.required, Validators.minLength(5)]],
      gender:[null, [Validators.required, this.genderVerify()]]
    });
  }
  forbiddenNameValidator(nameRe: RegExp):ValidatorFn{
      return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }

  genderVerify(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
        control.value?.toLowerCase() === 'male' ? null : {wrongColor: control.value} && control.value?.toLowerCase() === 'female' ? null : {wrongColor: control.value};
  }

  get name() : FormControl {
    return this.loginForm.get("name") as FormControl;
  }
  get email() : FormControl {
    return this.loginForm.get("email") as FormControl;
  }
  get tel() : FormControl {
    return this.loginForm.get("tel") as FormControl;
  }
  get password() : FormControl {
    return this.loginForm.get("password") as FormControl;
  }
  get gender() : FormControl {
    return this.loginForm.get("gender") as FormControl;
  }
  register():void{
    if(this.loginForm.invalid) {this.showServerError=true;return;}
    this.showServerError=false;
    const payLoad={name:this.name.value, email: this.email.value, tel: this.tel.value, password: this.password.value, gender: this.gender.value};
    this.reg(payLoad).subscribe({
      next: (res) => {
        window.localStorage['token'] = res.token;
      },
      error: () => {
        this.showServerError = true;
      }
    });
  }
  reg(body: { name: any; email: any; tel: any; password: any; gender: any; }): Observable<any> {
    return this.httpClient.post(`${this.serverUrl}/register`, body);
  }
}
