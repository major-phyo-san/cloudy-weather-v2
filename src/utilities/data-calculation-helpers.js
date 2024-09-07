export function calculateDewpoint(airTemperature, humidity)
{
    let a = 17.27;
    let b = 237.7;
    let RH = (humidity/100);
    let T = airTemperature;
    let alphaTRH = ((a * T) / (b + T)) + Math.log(RH);
    let Td = (b * alphaTRH)/(a - alphaTRH);
    Td = Math.round(Td * 100)/100;

    return Td;
}