import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../../services/http-client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
// [x: string]: Observable<void>;
  availableData: any;
  alreadyRegistered: boolean = false
  visitorForm!: FormGroup;
  checkInForm!: FormGroup;
  submitted: boolean = false;
  checkedIn: boolean = false;
  errorMessage:any;
  laptopSerialNums:any;
  searchResults: any;
  regiUserDetails:any;
  public showWebcam = true;

  
  @ViewChild('webcam') webcam: any;
  public webcamImage!: WebcamImage;
  public trigger$: Subject<void> = new Subject<void>();

  constructor(private router: Router, private service: HttpClientService, private formBuilder: FormBuilder, private snackBar: MatSnackBar, 
  private afStorage: AngularFireStorage) {
    // this.alreadyRegistered = true
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000, // Duration in milliseconds
    });
  }

  public triggerSnapshot(): void {
    this.trigger$.next();
  }

  public clearPhoto(): void {
    this.webcamImage!;
    this.showWebcam = true;
  }

  public handleInitError(error: WebcamInitError): void {
    console.error('Webcam initialization error:', error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.showWebcam = false;
  }

  
  async uploadImageToFirebase(): Promise<void> {
    const imageBlob = await fetch(this.webcamImage.imageAsDataUrl).then(response => response.blob());
    const compressedBlob = await this.compressImage(imageBlob, 0.3); // Adjust compression quality here (0.3 means 30% quality)
      const contentLength = imageBlob.size;
    const filePath = `vima-app-image-store/${new Date().getTime()}_${this.webcamImage.imageAsDataUrl}`;
    const fileRef = this.afStorage.ref(filePath);
    // const uploadTask = fileRef.put(imageBlob);
    const uploadTask = fileRef.put(compressedBlob, {
      customMetadata: {
        'Content-Length': contentLength.toString() // Set the Content-Length as a custom metadata field
      }
    });
    uploadTask.then(() => {
      console.log('Image uploaded to Firebase Storage');
    }).catch(error => {
      console.error('Error uploading image to Firebase Storage:', error);
    });
  }
  async compressImage(blob: Blob, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context is not supported'));
          return;
        }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((compressedBlob) => {
          if (!compressedBlob) {
            reject(new Error('Error compressing image'));
            return;
          }
          resolve(compressedBlob);
        }, 'image/jpeg', quality);
      };
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    });
  }

  
  
  ngOnInit() {
    //existing user
    this.checkInForm = this.formBuilder.group({
      laptopSerialNumberC: [''],
      whomToVisitC: ['', Validators.required],
      accountCardNumberC: ['', Validators.required],
      companyNameC: ['', Validators.required],
      purposeOfVisitC: ['', Validators.required]
    });

    // new user
    this.visitorForm = this.formBuilder.group({
      visitorName: ['', Validators.required],
      contactNumber: ['', Validators.required],
      laptopSerialNumber: [''],
      companyName: ['', Validators.required],
      whomToVisit: ['', Validators.required],
      purposeOfVisit: ['', Validators.required],
      secitiryCardNumber:['',Validators.required]
    });
    this.availableData = this.service.getData();


    console.log(this.availableData.data?.userDetails);
    if (this.availableData.data?.userDetails) {
      this.alreadyRegistered = true
      this.checkInForm.controls['whomToVisitC'].setValue(this.availableData?.data?.userDetails?.whomtoVisit)
      this.checkInForm.controls['accountCardNumberC'].setValue(this.availableData?.data?.userDetails?.cardNumber)
    }
    else {
      this.alreadyRegistered = false;
    }
  }
  onCheckIn() {
    this.checkedIn = true;
    if (!this.checkInForm.valid) {
      Object.keys(this.checkInForm.controls).forEach(field => {
        const control = this.checkInForm.get(field);
        control!.markAsTouched({ onlySelf: true });
      });
    }
    // this.uploadImageToFirebase()
    console.log(this.checkInForm.value)
    if (this.checkInForm.valid) {
      console.log(this.checkInForm.value)
      let payload = {

          "checkId":null,
          "visitorID": this.availableData.data?.userDetails?.visitorID,
          "intime": null,
          "outtime": null,
          "latitude": null,
          "longitude": null,
          "flag1": null,
          "image": "dummy image",
          "visitingPurpose": this.checkInForm.value.purposeOfVisitC,
          "laptopSerialNumber": this.checkInForm.value.laptopSerialNumberC,
          "whomToVisit": this.checkInForm.value.whomToVisitC,
          "visitorType":  "REGULARVISITOR",//"REGULARVISITOR",  
          "companyName": this.checkInForm.value.companyNameC,
          "securityCardNumber":this.checkInForm.value.accountCardNumberC
          
      }
      this.service.checkIn(payload).subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
      this.router.navigateByUrl('/id-card')
    }
  }

  
  onSubmit() {
    this.submitted = true;
    if (!this.visitorForm.valid) {
      Object.keys(this.visitorForm.controls).forEach(field => {
        const control = this.visitorForm.get(field);
        control!.markAsTouched({ onlySelf: true });
      });
    }
    console.log(this.visitorForm.value.purposeOfVisit)
    // this.uploadImageToFirebase()
    if (this.visitorForm.valid) {
      let payload = {
          "intime": null,
          "outtime": null,
          "latitude": null,
          "longitude": null,
          "flag1": null,
          "image": "imagnew",
          "visitingPurpose": this.visitorForm.value.purposeOfVisit,
          "laptopSerialNumber": this.visitorForm.value.laptopSerialNumber,
          "whomToVisit": this.visitorForm.value.whomToVisit,
          "visitorType":  null,//"REGULARVISITOR",  
          "companyName":this.visitorForm.value.companyName,
          "securityCardNumber":this.visitorForm.value.secitiryCardNumber,
            "visitorInfoEntity": {
              "name": this.visitorForm.value.visitorName,
              "phone": this.visitorForm.value.contactNumber,
              "place": null,
              "companyName": this.visitorForm.value.companyName,
              "vehicleNumber": null,
              "address": null,
              "streetAddress": null,
              "city": null,
              "state": null,
              "country": null,
              "postal": null,
              "emailId":null,
              "visitorType":"REGULARVISITOR"  // 
            }
      }
      this.service.regSave(payload).subscribe(response => {
        console.log(response);
        this.regiUserDetails = response
        this.service.setvisitorData(this.regiUserDetails);
      this.router.navigateByUrl('/id-card')
      }, error => {
        console.error(error);
      });


    }
  }
  takePicture() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          const video = document.createElement('video');
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
          };

          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');

          if (context) { // Check if context is not null
            setTimeout(() => {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = canvas.toDataURL('image/png');
              sessionStorage.setItem('capturedImage', imageData); // Store image data in session storage
              video.srcObject = null;
              this.router.navigate(['/display-image']); // Navigate to the page to display the image
            }, 500); // Adjust timeout as needed for camera initialization
          } else {
            console.error('Canvas context is null');
          }
        })
        .catch((error) => {
          console.error('Error accessing the camera: ', error);
        });
    } else {
      console.error('getUserMedia is not supported');
    }
  }

  onCheckOut(){
let payload = {
  "checkId": this.availableData?.data?.userDetails?.checkId,
  "visitorID": this.availableData?.data?.userDetails?.visitorID,
  "intime": null,
  "outtime": null,
  "latitude": null,
  "longitude": null,
  "flag1": null,
  "image": "base64_encoded_image_string",
  "visitingPurpose": null,
  "laptopSerialNumber": null,
  "whomToVisit": this.availableData?.data?.userDetails?.whomtoVisit,
  "visitorType":  this.availableData?.data?.userDetails?.visitorType,//"REGULARVISITOR",  
  "companyName":null,
  "securityCardNumber":null
  }  
  this.service.checkOut(payload).subscribe(response => {
    // console.log(response);
    if(response){
      this.router.navigateByUrl('/confirmation')
    }
    
  }, error => {
    console.error(error);
  });
  }
}
