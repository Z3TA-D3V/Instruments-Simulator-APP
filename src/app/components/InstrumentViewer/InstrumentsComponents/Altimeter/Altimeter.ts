import { Component, Signal, signal, WritableSignal, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { AltimeterConfig, getAltimeterConfig } from './altimeter-config';
import { AltimeterChart } from './AltimeterChart/Altimeter';


interface Coordinates {
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
    pneumatic: {
        name: string,
        degree: number
    },
    electric: {
        name: string,
        degree: number
    }
}

interface AltimeterChartData {
    data: number[];
    label: number[];
}

@Component({
    selector: 'altimeter',
    imports: [NgClass, AltimeterChart],
    templateUrl: './Altimeter.html',
    styleUrls: ['./Altimeter.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
    altimeterChart = signal<AltimeterChartData>({
        data: [],
        label: []
    });
    coordinates = computed<Coordinates>(() => {
        const coordinates: Coordinates = {
            coordinateNumbers: [],
            coordinateGap: []
        };

        const radius = (this.altimeterConfig().clockWidth / 2) - this.altimeterConfig().numbersOffset;
        const gapRadius = (this.altimeterConfig().clockWidth / 2) - this.altimeterConfig().gapRadius;

        //Numbers Coordinates
        for (let i = 0; i < this.altimeterConfig().numberAmount; i++) {
            const angle = (i * 2 * Math.PI) / this.altimeterConfig().numberAmount;
            coordinates.coordinateNumbers.push({ number: i, x: radius * Math.cos(angle - Math.PI / 2), y: radius * Math.sin(angle - Math.PI / 2), degree: angle * 180 / Math.PI });
        }

        //Gap Coordinates
        for (let j = 0; j < this.ALTIMETER_GAP_AMOUNT * this.altimeterConfig().numberAmount; j++) {
            const gapAngle = (j * 2 * Math.PI) / (this.ALTIMETER_GAP_AMOUNT * this.altimeterConfig().numberAmount);
            coordinates.coordinateGap.push({ x: gapRadius * Math.cos(gapAngle - Math.PI / 2), y: gapRadius * Math.sin(gapAngle - Math.PI / 2), degree: gapAngle * 180 / Math.PI });
        }

        return coordinates;
    });

    coordinatesKnob = signal<CoordinatesKnob[]>([])

    TOTAL_DEGREES: number = 360;
    FEET_PER_ALTIMETER: number = 1000;
    BAROMETRIC_ALTITUDE_DEFAULT: number = 2882;

    DEFAULT_ALTITUDE: number = 10000;
    DEFAULT_DEGREES: number = 0;

    CLIMB_RATE: number = 800; // feet per second
    SIMULATION_QUOTA: number[] = [200, 800, -200, -700, -300, 200, 700, 100, 0];
    TELEMETRY_REFRESH_RATE: number = 20; // milliseconds
    currentAltitudeInfo: WritableSignal<{ realAltitude: number, fixedAltitude: number, degrees: number }> = signal({ realAltitude: this.DEFAULT_ALTITUDE, fixedAltitude: this.DEFAULT_ALTITUDE, degrees: this.DEFAULT_DEGREES });

    altitudeInterval !: NodeJS.Timeout;
    climbRateInterval !: NodeJS.Timeout;

    pneuModes: PneuMode = {
        pneumatic: {
            name: "PNEU",
            degree: 0
        },
        electric: {
            name: "ELECT",
            degree: 45
        }
    }
    pneuModeSelected = signal<{ name: string, degree: number }>(this.pneuModes.pneumatic);

    altitudeCalibration = signal<number>(this.BAROMETRIC_ALTITUDE_DEFAULT);
    currentKnobCalibrationDegrees = signal<number>(this.DEFAULT_DEGREES);

    literals = signal({
        calibrationAltitude: "IN. MG",
        altitudex1000ft: "1000"
    })

    constructor() {
        let currentDegrees = parseFloat((parseFloat(((this.DEFAULT_ALTITUDE) / this.FEET_PER_ALTIMETER % 1).toFixed(3)) * this.TOTAL_DEGREES).toFixed(2));
        this.currentAltitudeInfo.set({ realAltitude: this.DEFAULT_ALTITUDE, fixedAltitude: this.DEFAULT_ALTITUDE, degrees: currentDegrees });
    }


    onTestClick(): void {
        this.startSimulation();
    }

    onStopClick(): void {
        let degrees = parseFloat((parseFloat(((this.DEFAULT_ALTITUDE) / this.FEET_PER_ALTIMETER % 1).toFixed(3)) * this.TOTAL_DEGREES).toFixed(2));
        this.currentAltitudeInfo.set({ realAltitude: this.DEFAULT_ALTITUDE, fixedAltitude: this.DEFAULT_ALTITUDE, degrees: degrees });
        clearInterval(this.altitudeInterval)
        clearInterval(this.climbRateInterval)
    }

    onChangePneumaticMode(mode: string): void {
        if (mode === this.pneuModes.pneumatic.name.toLowerCase()) {
            this.pneuModeSelected.set(this.pneuModes.pneumatic);
            return
        }
        if (mode === this.pneuModes.electric.name.toLowerCase()) {
            this.pneuModeSelected.set(this.pneuModes.electric)
            return
        }
    }

    onBarometricPressure(operation: string): void {
        let angle = (360 / this.ALTIMETER_KNOB_POSITIONS);
        if (operation == '+') {
            this.currentKnobCalibrationDegrees.update((degree) => degree += angle)
            this.altitudeCalibration.update(calibration => ++calibration);
            return
        }

        if (operation == "-") {
            this.currentKnobCalibrationDegrees.update((degree) => degree -= angle)
            this.altitudeCalibration.update(calibration => --calibration);
            return
        }

        if (operation === "reset") {
            this.currentKnobCalibrationDegrees.set(this.DEFAULT_DEGREES)
            this.altitudeCalibration.set(this.BAROMETRIC_ALTITUDE_DEFAULT);
            return
        }

    }

    startSimulation(): void {
        let ms: number = 0;
        let climbRate = this.CLIMB_RATE;

        if (this.altitudeInterval) {
            clearInterval(this.altitudeInterval);
        }
        if (this.climbRateInterval) {
            clearInterval(this.climbRateInterval);
        }

        if (this.SIMULATION_QUOTA.length) {
            let climbRateIndex = 0;

            this.climbRateInterval = setInterval(() => {
                climbRate = this.SIMULATION_QUOTA[climbRateIndex];
                if (climbRateIndex == this.SIMULATION_QUOTA.length - 1) {
                    climbRateIndex = 0;
                } else {
                    climbRateIndex++;
                }
            }, 2000);
        }

        this.altitudeInterval = setInterval(() => {
            const increment = this.getSimulationClimbRatePlotted(climbRate, this.TELEMETRY_REFRESH_RATE);
            let currentAltitude = parseFloat((this.currentAltitudeInfo().realAltitude + increment).toFixed(5));
            let fixedAltitude = parseFloat((currentAltitude).toFixed(0));
            let currentDegrees = parseFloat((parseFloat(((currentAltitude) / this.FEET_PER_ALTIMETER % 1).toFixed(3)) * this.TOTAL_DEGREES).toFixed(2));
            this.currentAltitudeInfo.set({ realAltitude: currentAltitude, fixedAltitude: fixedAltitude, degrees: currentDegrees });
            console.log(`Altimeter: ${this.currentAltitudeInfo().realAltitude} ft | Degrees: ${this.currentAltitudeInfo().degrees}`);

            this.altimeterChart.update(chart => {
                const newData = [...(chart.data ?? []), fixedAltitude];
                const newLabels = [...(chart.label ?? []), ms += this.TELEMETRY_REFRESH_RATE];

                if (newData.length > 100) {
                    newData.shift();
                    newLabels.shift();
                }

                return {
                    data: newData,
                    label: newLabels
                };
            });
        }, this.TELEMETRY_REFRESH_RATE);

    }

    getSimulationClimbRatePlotted(climbRate: number, telemetryRefreshRate: number): number {
        const increment = climbRate / 1000 * telemetryRefreshRate; // Get the increment per 50ms
        return increment;
    }




}
