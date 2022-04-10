import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TEST_ENDPOINT } from 'src/app/constants/api-endpoints';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private readonly httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  getName() {
    return "ETHAN";
  }

  testAuth() {
    this.httpClient.get(environment.apiServer + TEST_ENDPOINT).subscribe({
      next: (response) => {
          console.info("User is authenticated!");
      },
      error: (error) => {
        console.info("User is not authenticated!");
      }
  });
  }
}
