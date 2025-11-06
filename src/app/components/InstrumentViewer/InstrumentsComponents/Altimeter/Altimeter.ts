import { Component, Signal, signal, WritableSignal, } from '@angular/core';
import { clear } from 'console';

@Component({
  selector: 'altimeter',
  imports: [],
  templateUrl: './Altimeter.html',
})
export class Altimeter {

    
    DEFAULT_ALTITUDE: number = 1000;
    CLIMB_RATE: number = 833; // feet per minute
    TELEMETRY_REFRESH_RATE: number = 50; // milliseconds
    currentAltitude: WritableSignal<number> = signal(this.DEFAULT_ALTITUDE);
    
    altitudeInterval !: NodeJS.Timeout;
    

    onTestClick(): void{
        this.startSimulation();
    }

    onStopClick(): void{
        this.currentAltitude.set(this.DEFAULT_ALTITUDE);
        clearInterval(this.altitudeInterval)
    }

    startSimulation(): void {
        if (this.altitudeInterval) {
            clearInterval(this.altitudeInterval);
        }
        // Implementation for starting the simulation can be added here
        const increment = this.getSimulationIncrement(this.CLIMB_RATE, this.TELEMETRY_REFRESH_RATE);
        this.altitudeInterval = setInterval(() => {
            this.currentAltitude.set(this.currentAltitude() + increment);
            console.log(`Altimeter: ${this.currentAltitude()} ft`);
        }, this.TELEMETRY_REFRESH_RATE);

    }

    getSimulationIncrement(climbRate: number, telemetryRefreshRate: number): number {
        const increment = climbRate / 1000 * telemetryRefreshRate; // Get the increment per 50ms
        return increment;
    }


}
