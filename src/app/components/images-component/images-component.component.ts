import { Pptx2imgService } from './../../services/pptx2img.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageItem } from '../../models/imageItemModel';
import JSZip from 'jszip';


@Component({
  selector: 'app-images-component',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './images-component.component.html',
  styleUrl: './images-component.component.scss'
})
export class ImagesComponentComponent {
  selectedFile: File | null = null;
  imageUrls: string[] = [];
  selectedZipFormat: string = 'png'; // Default format

  images: ImageItem[] = Array.from({ length: 10 }, (_, i) => ({
    src: 'assets/placeholder.png',
    name: `names of images ${i + 1}`
  }));
  constructor(private pptx2imgService: Pptx2imgService) {}
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  // uploadFile() {
  //   if (!this.selectedFile) {
  //     alert('Please select a file first.');
  //     return;
  //   }

  //   this.pptx2imgService.uploadFile(this.selectedFile).subscribe({
  //     next: (response) => console.log('Upload successful:', response),
  //     error: (error) => console.error('Upload failed:', error)
  //   });
  // }





  // convertFile() {
  //   if (!this.selectedFile) {
  //     alert('Please select a file first.');
  //     return;
  //   }

  //   this.pptx2imgService.convertFile(this.selectedFile.name,"png").subscribe({
  //     next:async (response) =>{


  //       this.extractFiles(response)
  //       console.error('convert successful:')

  //     },
  //     error: (error) => console.error('convert failed:', error)
  //   });
  // }

  // convertFile22() {
  //   if (!this.selectedFile) {
  //     alert('Please select a file first.');
  //     return;
  //   }
  
  //   this.pptx2imgService.convertFile22(this.selectedFile, "png").subscribe({
  //     next: (response) => {
  //       const blob = new Blob([response], { type: 'application/zip' });
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `${this.selectedFile?.name.split('.')[0]}.zip`;
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //       console.log('Convert successful');
  //     },
  //     error: (error) => console.error('Convert failed:', error)
  //   });
  // }
  
  // convertFile() {
  //   if (!this.selectedFile) {
  //     alert('Please select a file first.');
  //     return;
  //   }

  //   this.pptx2imgService.convertFile22(this.selectedFile, "png").subscribe({
  //     next: async (response) => {
  //       const zip = new JSZip();
  //       const zipContent = await zip.loadAsync(response);

  //       this.imageUrls = [];

  //       Object.keys(zipContent.files).forEach(async (fileName) => {
  //         if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
  //           const fileData = await zipContent.files[fileName].async('blob');
  //           const imageUrl = URL.createObjectURL(fileData);
  //           this.imageUrls.push(imageUrl);
  //         }
  //       });
  //     },
  //     error: (error) => console.error('Convert failed:', error)
  //   });
  // }

  uploadtest(): void {
    if (!this.selectedFile) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('fileFormat', this.selectedZipFormat);

    this.pptx2imgService.convertFiletest(formData).subscribe({
      next: async (blob: Blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        // Générer un nom de fichier ZIP à partir du nom d'origine sans extension
        link.download = `${this.selectedFile!.name.split('.')[0]}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        const zip = new JSZip();
        const zipContent = await zip.loadAsync(blob);
        this.imageUrls = [];

        Object.keys(zipContent.files).forEach(async (fileName) => {
          if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
            const fileData = await zipContent.files[fileName].async('blob');
            const imageUrl = URL.createObjectURL(fileData);
            this.imageUrls.push(imageUrl);
          }
        });
      },
      error: (error) => console.error('Convert failed:', error)
    });
  }




  selectedImages: Set<ImageItem> = new Set();
  imageSize: number = 250; // Default size
  displayPeriod: number = 1; // Default display period
  Array: any;
  get imageSizeLabel(): string {
    if (this.imageSize <= 150) return '0%';
    if (this.imageSize <= 200) return '25%';
    if (this.imageSize <= 250) return '50%';
    if (this.imageSize <= 300) return '75%';
    return '100%';
  }
  trackByFn(index: number, item: ImageItem) {
    return item.name;
  }
  toggleSelection(image: ImageItem) {
    if (this.selectedImages.has(image)) {
      this.selectedImages.delete(image);
    } else {
      this.selectedImages.add(image);
    }
  }

  selectAll() {
    if (this.selectedImages.size === this.images.length) {
      this.selectedImages.clear();
    } else {
      this.selectedImages = new Set(this.images);
    }
  }

  confirm() {
    console.log("Confirmed selection:", Array.from(this.selectedImages));
  }
  undo() {
    throw new Error('Method not implemented.');
    }


}
