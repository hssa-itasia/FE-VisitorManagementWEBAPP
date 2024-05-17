import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../../services/http-client.service';

@Component({
  selector: 'app-visitor-digital-id',
  templateUrl: './visitor-digital-id.component.html',
  styleUrl: './visitor-digital-id.component.scss'
})
export class VisitorDigitalIdComponent {
  vidistorCardDetails:any;
  inDate:any;
  inTime:any;
  constructor(private router: Router, private service: HttpClientService) {

  }

  ngOnInit() {
    this.vidistorCardDetails = this.service.getvisitorData()
    const intimeC = this.vidistorCardDetails?.data?.savedCheckInOut?.intime;
    if(intimeC){
    const [date, time] = intimeC.split(' ');
    this.inDate = date;
    this.inTime = time;
    }
  }
  onClose() {
    this.router.navigateByUrl('/confirmation');
  }
//   {
//   "savedCheckInOut": {
//     "checkId": 261,
//       "visitorID": null,
//         "intime": "05/17/2024 16:44:33",
//           "outtime": null,
//             "laptopSerialNumber": "liuyu7678",
//               "visitingPurpose": "meeting",
//                 "securityCardNumber": "980",
//                   "companyName": "rigved it",
//                     "totalHours": null,
//                       "visitorType": null,
//                         "whomToVisit": "tushar",
//                           "image": "imagnew",
//                             "flag1": "True",
//                               "flag2": "False",
//                                 "latitude": null,
//                                   "longitude": null,
//                                     "visitorInfoEntity": {
//       "id": 260,
//         "slno": "00005172024164433",
//           "name": "kishan m",
//             "phone": "8460368896",
//               "place": null,
//                 "address": null,
//                   "streetAddress": null,
//                     "city": null,
//                       "state": null,
//                         "country": null,
//                           "postal": null,
//                             "visitorId": "VIMA25601",
//                               "emailId": null,
//                                 "visitorType": "REGULARVISITOR"
//     }
//   }
// }
}
