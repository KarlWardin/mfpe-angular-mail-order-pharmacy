import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Mail Order Pharmacy';

  constructor(private router: Router, public serve: AuthService) {

  }



  logout() {
    localStorage.removeItem("token");
    this.serve.logout();

    console.log('User has been logged out from the system');
    this.router.navigate(['/']);
  }




}



