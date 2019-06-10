import { Component, OnInit } from '@angular/core';
import {Observable, Observer} from "rxjs";

@Component({
  selector: 'app-decode',
  templateUrl: './decode.component.html',
  styleUrls: ['./decode.component.css']
})
export class DecodeComponent{
  name = 'Angular';
  base64TrimmedURL: any;
  base64DefaultURL: any;
  generatedImage: any;

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
    this.base64DefaultURL = dataURL;
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }


  getImage(url) {
    this.getBase64ImageFromURL(url).subscribe((data:string) => {
      this.base64TrimmedURL = data;
    });
    // Naming the image
    const date = new Date().valueOf();
    let text = '';
    const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(Math.floor(Math.random() *    possibleText.length) );
    }
    // Replace extension according to your media type like this
    const imageName = date + '.' + text + '.jpeg';
    console.log(imageName);
    // call method that creates a blob from dataUri
    let imageBlob;
    this.dataURItoBlob(this.base64TrimmedURL).subscribe(data => {
      imageBlob = data;
    });
    const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
    this.generatedImage =  window.URL.createObjectURL(imageFile);
    window.open(this.generatedImage);
  }

  dataURItoBlob(dataURI): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString = window.atob(dataURI);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/jpeg' });
      observer.next(blob);
      observer.complete();
    });
  }

  ngOnInit(): void {
  }
}
