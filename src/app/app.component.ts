import { Component } from '@angular/core';
// import { HelloComponent } from './hello/hello.component';
// import { RecordsService } from './records.service';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';


// function log(target, name, descriptor) {
//   // console.log(target, name, descriptor);
//   // store the original function in a variable
//   const original = descriptor.value;
//   // do some manipulations with descriptor.value
//   descriptor.value = function(...args) {
//     console.log('Arguments ', args, ' were passed in this function.');
//     const result   = original.apply(this, args);
//     console.log('the result of the function is ', result);
//     return result;
// };
//   return descriptor;

// }

// function log(a, b) {
//    console.log(b);
//    return a * b;
// }



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private router: Router, private auth: AuthService) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }

}
