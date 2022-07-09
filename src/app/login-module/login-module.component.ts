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
    if(this.authService.isLoggedIn()){
      this.router.navigate(['home']);
    }
  }


  ngOnInit(): void { }

  // first call login from authentication-service and get token
  // next call validate from authentication-service to get validated
  // if validate returns true then call logIn from auth-service in angular
  // if returns false then call logout from auth-service in angular
  onLogin(custForm: NgForm) {

    console.log(custForm.value.userid);
    console.log(custForm.value.password);

    this.user.userid = custForm.value.userid;
    this.user.upassword = custForm.value.password;
    this.user.uname = custForm.value.userid;

    this.userService.loginMember(this.user).subscribe(data => {
      this.errMsg = '';
      console.log(data);

      this.userDtls = data as UserDetails;
      localStorage.setItem("userId", this.userDtls.userid);
      localStorage.setItem("token", this.userDtls.authToken);
      console.log(this.userDtls.authToken);
      let response = this.userService.validateToken(this.userDtls.authToken);
      response.subscribe(data1 => {
        console.log(data1);
        this.authResponse = data1 as AuthenticationResponse;
        console.log(this.authResponse.name, this.authResponse.valid);
        if (this.authResponse.valid) {
          console.log("true valid");
          this.authService.login()

        }
        else {
          console.log("false valid");
          this.authService.logout();
        }
        if (this.authService.isLoggedIn()) {
          localStorage.setItem('userId', this.authResponse.userid);
          this.router.navigate(['home']);
        }

      });

      //localStorage.getItem("token");

    }, error => {

      this.errMsg = "Invalid Credentials!"
    })
    custForm.reset();
  }
}