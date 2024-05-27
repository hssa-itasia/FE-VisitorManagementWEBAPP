import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../../services/http-client.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  responseData:any;
  mobileNo:any;
  errorMessage!: string;

constructor(private router:Router, private service: HttpClientService,private snackBar: MatSnackBar){

}
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 2000, // Duration in milliseconds
  });
}
ngOnInit(){
  
}
  onSubmit(){
    if (this.mobileNo?.length === 10 ||  this.mobileNo !== undefined) {
    this.service.serachMobileNo(this.mobileNo).subscribe(
      (response) => {
        this.responseData = response;
        this.service.setmobileNo(this.mobileNo);
        this.router.navigateByUrl('/register')
        this.service.setData(this.responseData)
      },
      (error) => {
        this.errorMessage = error;
        this.service.setData('')
        this.router.navigateByUrl('/register')
        this.service.setmobileNo(this.mobileNo);
        // this.openSnackBar("No visitor found with the provided mobile number.", 'OK')
        // this.openSnackBar(this.errorMessage, 'OK')
      }
    );
  }
  else{
        this.openSnackBar("Enter Valid Mobile Number", 'OK')
  }
  }
}
