import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImagesComponentComponent } from "./components/images-component/images-component.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImagesComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pptx_image_';
}
