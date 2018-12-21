import { Component } from '@angular/core';
import { LoadingHandlerService } from 'app/services/loading-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'malibu';

  constructor(public loader: LoadingHandlerService) {}
}
