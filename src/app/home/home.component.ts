import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string = "Mail Order Pharmacy";
  userId: string | null = "";

  constructor(private route: Router, private authService: AuthService) {

    if (!this.authService.isLoggedIn()) {
      this.route.navigate(["/loginModule"]);
    } else {
      this.userId = localStorage.getItem("userId");
    }
  }

  ngOnInit(): void {
  }

}
