import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../../services/http-client.service';

@Component({
  selector: 'app-visitor-digital-id',
  templateUrl: './visitor-digital-id.component.html',
  styleUrl: './visitor-digital-id.component.scss'
})
export class VisitorDigitalIdComponent {
  vidistorCardDetails: any;
  inDate: any;
  inTime: any;
  uploadedImage: any;
  manipulatedUrl!: string;

  constructor(private router: Router, private service: HttpClientService) {

  }

  ngOnInit() {
    this.uploadedImage = this.service.getimageUrl();
    console.log(this.uploadedImage);
    this.manipulatedUrl = this.uploadedImage.toString();
    console.log(this.manipulatedUrl);
    this.vidistorCardDetails = this.service.getvisitorData()
    const intimeC = this.vidistorCardDetails?.data?.savedCheckInOut?.intime ? this.vidistorCardDetails?.data?.savedCheckInOut?.intime : this.vidistorCardDetails?.data?.intime;
    if (intimeC) {
      const [date, time] = intimeC.split(' ');
      this.inDate = date;
      this.inTime = time;
    }
  }
  onClose() {
    this.router.navigateByUrl('/confirmation');
  }

}
