import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Altimeter } from './InstrumentsComponents/Altimeter/Altimeter';

@Component({
  selector: 'instrument-viewer',
  imports: [Altimeter],
  templateUrl: './InstrumentViewer.html',
  styleUrls: ['./InstrumentViewer.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstrumentViewer {





}
