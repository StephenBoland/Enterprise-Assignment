import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

//there is no build in validator for an image, so here we build this
export const imgType = (control: AbstractControl): Promise<{[key:string]:any}> | Observable<{[key:string]:any}> => {
  const chosenfile = control.value as File;
  const fileReader = new FileReader();
  const obs = Observable.create((observer:Observer<{[key:string]:any}>) => {
    fileReader.addEventListener("loadend", () => {
      const array = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4); //read certain patterns using 8array
      let header = "";
      let isValid = false;
      for (let i = 0; i< array.length; i++){
        header += array[i].toString(16);
      }
      switch (header) {
        case "89504e47":
            isValid = true;
            break;
          case "ffd8ffe0": //these stand for different file types (png's and jpegs)
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
      }
      if(isValid) {
        observer.next(null);
      } else {
        observer.next({invalidMimeType:true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(chosenfile);
  });
  return obs;
};
