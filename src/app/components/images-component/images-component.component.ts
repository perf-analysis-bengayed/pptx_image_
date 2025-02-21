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

  uploadFile() {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    this.pptx2imgService.uploadFile(this.selectedFile).subscribe({
      next: (response) => console.log('Upload successful:', response),
      error: (error) => console.error('Upload failed:', error)
    });
  }





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
  convertFile(): void {
    if (!this.selectedFile) {
      alert('Veuillez sélectionner un fichier d\'abord.');
      return;
    }
  
    this.pptx2imgService.uploadFile(this.selectedFile).subscribe({
      next: () => {
        if (this.selectedFile !== null) {
          this.pptx2imgService.convertFile(this.selectedFile.name, 'png').subscribe({
            next: async (response) => {
              await this.extractFiles(response);
              console.log('Conversion réussie');
            },
            error: (error) => console.error('Échec de la conversion :', error)
          });
        } else {
          // Gérez le cas où selectedFile est null
          console.error('Le fichier sélectionné est null.');
        }
      },
      error: (error) => console.error('Échec du téléchargement :', error)
    });
  }
  

  // Méthode pour extraire les fichiers du blob
  private async extractFiles(blob: Blob): Promise<void> {
    const zip = new JSZip();
    const unzipped = await zip.loadAsync(blob);

    this.images = []; // Réinitialiser les images précédentes
    const imagePromises: Promise<{ src: string, name: string }>[] = [];

    unzipped.forEach((relativePath, file) => {
      if (file.name.endsWith('.jpg') || file.name.endsWith('.png')) {
        const imagePromise = file.async('blob').then(content => {
          const objectURL = URL.createObjectURL(content);
          return { src: objectURL, name: file.name };
        });
        imagePromises.push(imagePromise);
      }
    });

    const extractedImages = await Promise.all(imagePromises);
    this.images = extractedImages.sort((a, b) => a.name.localeCompare(b.name));
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
