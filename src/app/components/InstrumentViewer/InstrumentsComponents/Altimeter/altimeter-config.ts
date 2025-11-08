export interface AltimeterConfig { 
    altimeterWidth: number;
    altimeterHeight: number;

    clockWidth: number;
    clockHeight: number;

    numbersOffset: number;

    numberAmount: number;
    altimeterGapAmount: number;
    gapRadius: number;
 }

 export const getAltimeterConfig = (width: number, height: number, clockOffset: number, numbersOffset: number, numberAmount: number, altimeterGapAmount:number, gapRadius: number): AltimeterConfig => {
    
    const clockWidth = width - clockOffset;
    const clockHeight = height - clockOffset;

    
    return {
        altimeterWidth: width,
        altimeterHeight: height,

        clockWidth: clockWidth,
        clockHeight: clockHeight,

        numbersOffset: numbersOffset,

        numberAmount: numberAmount,
        altimeterGapAmount: altimeterGapAmount,
        gapRadius: gapRadius
    };
};
