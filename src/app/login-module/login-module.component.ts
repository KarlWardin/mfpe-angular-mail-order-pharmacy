import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';
import { AuthenticationResponse } from '../authentication-response';
import { AuthService } from '../auth.service';
import { UserDetails } from '../user-details';

@Component({
  selector: 'app-login-module',
  templateUrl: './login-module.component.html',
  styleUrls: ['./login-module.component.css']
})
export class LoginModuleComponent implements OnInit {
  token!: string;
  errMsg!: string;
  user: User = {
    'userid': " ",
    'upassword': " ",
    'uname': ""
  };
  userDtls!: UserDetails
  authResponse: AuthenticationResponse = {
    'userid': "",
    'name': "",
    'valid': false
  };
  constructor(private userService: UserService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }


  ngOnInit(): void { }

  // first call login from authentication-service and get token
  // next call validate from authentication-service to get validated
  // if validate returns true then call logIn from auth-service in angular
  // if returns false then call logout from auth-service in angular
  onLogin(custForm: NgForm) {

    this.user.userid = custForm.value.userid;
    this.user.upassword = custForm.value.password;
    this.user.uname = custForm.value.userid;

    this.userService.loginMember(this.user).subscribe(data => {
      this.errMsg = '';
      this.userDtls = data as UserDetails;
      let response = this.userService.validateToken(this.userDtls.authToken);
      response.subscribe(data1 => {
        this.authResponse = data1 as AuthenticationResponse;
        console.log(this.authResponse.name, this.authResponse.valid);
        if (this.authResponse.valid) {
          localStorage.setItem("userId", this.userDtls.userid);
          localStorage.setItem("token", this.userDtls.authToken);
          this.authService.login();
        }
        else {
          this.authService.logout();
        }

        if (this.authService.isLoggedIn()) {
          this.router.navigate(['']);
        }

      });

      //localStorage.getItem("token");

    }, error => {

      this.errMsg = "Invalid Credentials!"
    })
    custForm.reset();
  }
}