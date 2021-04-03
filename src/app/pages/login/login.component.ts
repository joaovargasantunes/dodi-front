import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public ano = moment().year();

  constructor(
    private fb: FormBuilder
  ) {
    document.body.classList.add('bg-dark');
    this.form = this.fb.group({
      usu_senha: [null, Validators.required],
      usu_email: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  enviar() {

  }
}
