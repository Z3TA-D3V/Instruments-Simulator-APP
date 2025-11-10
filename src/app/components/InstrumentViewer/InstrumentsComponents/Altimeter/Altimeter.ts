import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { NgClass } from '@angular/common';
import { AltimeterConfig, getAltimeterConfig } from './altimeter-config';


interface Coordinates{
    coordinateNumbers: CoordinatesNumbers[];
    coordinateGap: CoordinatesGap[];
}

interface CoordinatesNumbers {
    x: number;
    y: number;
    number: number;
    degree?: number;

}

interface CoordinatesGap {
    x: number;
    y: number;
    degree?: number;
    number?: number;
}

interface CoordinatesKnob {
    x: number;
    y: number;
    degree?: number;
    number?: number;
}


interface PneuMode {
    pneumatic: string,
    electric: string
}

@Component({
  selector: 'altimeter',
  imports: [NgClass],
  templateUrl: './Altimeter.html',
  styleUrls: ['./Altimeter.css']
})
export class Altimeter {

    ALTIMETER_WIDTH: number = 450;
    ALTIMETER_HEIGHT: number = 450;
    ALTIMETER_CLOCK_OFFSET: number = 65;
    ALTIMETER_NUMBERS_OFFSET: number = 55;
    ALTIMETER_NUMBER_AMOUNT: number = 10;
    ALTIMETER_GAP_AMOUNT: number = 5;
    ALTIMETER_GAP_OFFSET: number = 20;

    ALTIMETER_KNOB_POSITIONS: number = 30;

    altimeterConfig = signal<AltimeterConfig>(getAltimeterConfig(this.ALTIMETER_WIDTH, this.ALTIMETER_HEIGHT, this.ALTIMETER_CLOCK_OFFSET, this.ALTIMETER_NUMBERS_OFFSET, this.ALTIMETER_NUMBER_AMOUNT, this.ALTIMETER_GAP_AMOUNT, this.ALTIMETER_GAP_OFFSET)); // width, height, clock face offset, numbers offst, numberAmount
    coordinates = signal<Coordinates>({
        coordinateNumbers: [],
        coordinateGap: []
    });

    coordinatesKnob = signal<CoordinatesKnob[]>([])
    
    TOTAL_DEGREES: number = 360;
    FEET_PER_ALTIMETER: number = 1000;
    BAROMETRIC_ALTITUDE_DEFAULT: number = 2882;

    DEFAULT_ALTITUDE: number = 10000;
    DEFAULT_DEGREES: number = 0;

    CLIMB_RATE: number = 800; // feet per second
    TELEMETRY_REFRESH_RATE: number = 5; // milliseconds
    currentAltitudeInfo: WritableSignal<{realAltitude: number, fixedAltitude: number, degrees: number}> = signal({realAltitude: this.DEFAULT_ALTITUDE, fixedAltitude: this.DEFAULT_ALTITUDE, degrees: this.DEFAULT_DEGREES});
    
    altitudeInterval !: NodeJS.Timeout;

    pneuModes: PneuMode = {
        pneumatic: "PNEU",
        electric: "ELECT"
    }
    pneuModeSelected = signal<string>(this.pneuModes.pneumatic);

    altitudeCalibration = signal<number>(this.BAROMETRIC_ALTITUDE_DEFAULT);
    currentKnobCalibrationDegrees = signal<number>(this.DEFAULT_DEGREES);

    literals = signal({
        calibrationAltitude: "IN. MG",
        altitudex1000ft: "1000"
    })

    constructor() {
        const coords: Coordinates  = this.generateNumbersCoordinates();
        // const coordsKnob: Coordinates[] = this.generateKnobCoordinates();
        this.coordinates.set(coords);
        console.log("Coordinates: ", this.coordinates());
    }
    

    onTestClick(): void{
        this.startSimulation();
    }

    onStopClick(): void{
        this.currentAltitudeInfo.set({realAltitude: this.DEFAULT_ALTITUDE, fixedAltitude: this.DEFAULT_ALTITUDE, degrees: this.DEFAULT_DEGREES});
        clearInterval(this.altitudeInterval)
    }

    onChangePneumaticMode(): void{
        if(this.pneuModeSelected() == this.pneuModes.pneumatic){
            this.pneuModeSelected.set(this.pneuModes.electric)
        }else{
            this.pneuModeSelected.set(this.pneuModes.pneumatic)
        }
    }

    onBarometricPressure(operation: string): void{
        let angle = (360 /this.ALTIMETER_KNOB_POSITIONS); 
        if(operation == '+'){
            this.currentKnobCalibrationDegrees.update((degree) => degree += angle)
            this.altitudeCalibration.update(calibration => ++calibration);
            return
        }

        if(operation == "-"){
            this.currentKnobCalibrationDegrees.update((degree) => degree -= angle)
            this.altitudeCalibration.update(calibration => --calibration);
            return
        }

        if(operation === "reset"){
            this.currentKnobCalibrationDegrees.set(this.DEFAULT_DEGREES)
            this.altitudeCalibration.set(this.BAROMETRIC_ALTITUDE_DEFAULT);
            return
        }

    }

    startSimulation(): void {

        if (this.altitudeInterval) {
            clearInterval(this.altitudeInterval);
        }

        const increment = this.getSimulationClimbRatePlotted(this.CLIMB_RATE, this.TELEMETRY_REFRESH_RATE);
        this.altitudeInterval = setInterval(() => {
            let currentAltitude = parseFloat((this.currentAltitudeInfo().realAltitude + increment).toFixed(5));
            let fixedAltitude = parseFloat((currentAltitude).toFixed(0));
            let currentDegrees = parseFloat((parseFloat(((currentAltitude)/this.FEET_PER_ALTIMETER % 1).toFixed(3)) * this.TOTAL_DEGREES).toFixed(2));
            this.currentAltitudeInfo.set({realAltitude: currentAltitude, fixedAltitude: fixedAltitude, degrees: currentDegrees});
            console.log(`Altimeter: ${this.currentAltitudeInfo().realAltitude} ft | Degrees: ${this.currentAltitudeInfo().degrees}`);
        }, this.TELEMETRY_REFRESH_RATE);

    }

    getSimulationClimbRatePlotted(climbRate: number, telemetryRefreshRate: number): number {
        const increment = climbRate / 1000 * telemetryRefreshRate; // Get the increment per 50ms
        return increment;
    }

    generateNumbersCoordinates(): Coordinates {
        const coordinates: Coordinates = {
            coordinateNumbers: [],
            coordinateGap: []
        };
        
        const radius = (this.altimeterConfig().clockWidth / 2) - this.altimeterConfig().numbersOffset;
        const gapRadius = (this.altimeterConfig().clockWidth / 2) - this.altimeterConfig().gapRadius;
        
        //Numbers Coordinates
        for (let i = 0; i < this.altimeterConfig().numberAmount; i++) {
            const angle = (i * 2 * Math.PI) / this.altimeterConfig().numberAmount;
            coordinates.coordinateNumbers.push({ number: i, x: radius * Math.cos(angle - Math.PI/2), y: radius * Math.sin(angle - Math.PI/2), degree: angle * 180/Math.PI });
        }

        //Gap Coordinates
        for (let j = 0; j < this.ALTIMETER_GAP_AMOUNT*this.altimeterConfig().numberAmount; j++) {
            const gapAngle = (j * 2 * Math.PI) / (this.ALTIMETER_GAP_AMOUNT * this.altimeterConfig().numberAmount);
            coordinates.coordinateGap.push({ x: gapRadius * Math.cos(gapAngle - Math.PI/2), y: gapRadius * Math.sin(gapAngle - Math.PI/2), degree: gapAngle * 180/Math.PI  });
        }

        return coordinates ;

    }

    // generateKnobCoordinates(): CoordinatesKnob[]{
    //     for(let i = 0; i<this.ALTIMETER_KNOB_POSITIONS; i++){
    //         const angleKnob = (i )
    //     }
    // }


}
