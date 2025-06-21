import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Login } from "./login/login";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Login],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'app';
}
