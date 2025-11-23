import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InstrumentViewer } from '../../../components/InstrumentViewer/InstrumentViewer';

@Component({
  selector: 'instrument-view',
  imports: [InstrumentViewer],
  templateUrl: './Instruments.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstrumentsView {





}
