export function getCurrentDate()
{
    return new Date().toISOString().split('T')[0];
}

export function getCurrentTime(hourOffset = 6, minuteOffset = 30)
{
    let currentUnixTimeStamp = Math.floor(Date.now());
    let hourOffsetTimestamp = (hourOffset * 3600) * 1000;
    let minuteOffsetTimestamp = (minuteOffset * 60) * 1000;
    let newUnixTimeStamp = currentUnixTimeStamp + hourOffsetTimestamp + minuteOffsetTimestamp;
    let dateTime = new Date(newUnixTimeStamp).toISOString().split('T');
    let timePart = dateTime[1];
    let time = timePart.split('.')[0];

    return time;
}

export function getCurrentDateTime(unixTimestamp = null, hourOffset = null, minuteOffset = null)
{
    let currentUnixTimeStamp = (unixTimestamp)? unixTimestamp: Math.floor(Date.now());    
    let hourOffsetTimestamp = (hourOffset)? (hourOffset * 3600) * 1000: 0;
    let minuteOffsetTimestamp = (minuteOffset)? (minuteOffset * 60) * 1000: 0;
    let newUnixTimeStamp = currentUnixTimeStamp + hourOffsetTimestamp + minuteOffsetTimestamp;
    let dateAndTime = new Date(newUnixTimeStamp).toISOString().split('T');
    let date = dateAndTime[0];
    let timePart = dateAndTime[1];
    let time = timePart.split('.')[0];

    return date + ' ' + time;
}

export function convertToFriendlyDate(dbDateString)
{
    const unixTimestamp = Date.parse(dbDateString);
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // Days of the week

    const date = new Date(unixTimestamp);
    const dayName = days[date.getDay()]; // Get the day of the week
    const month = months[date.getMonth()];
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();

    return `${month} ${day} (${dayName})`;
}

export function convertToFriendlyDateTime(dbDateString)
{
    const date = new Date(dbDateString);
    const options = {
        // year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        // second: '2-digit',
        hour12: true
      };

      const formattedTime = date.toLocaleTimeString('en-US', options);

      return formattedTime;
}

export function getFirstDate(dbDateString)
{
    let date = new Date(dbDateString);
    // Set the date to 1 to get the first date of the month
    date.setDate(1);
    // Format the result as "YYYY-mm-dd"
    let firstDateOfMonth = date.toISOString().split('T')[0];

    return firstDateOfMonth;
}

export function convertToMonth(dbDateString)
{
    const unixTimestamp = Date.parse(dbDateString);
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const date = new Date(unixTimestamp);
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month}, ${year}`;
}

export function getElapsedMoments(dbDateTimeString)
{
    const timestamp = new Date(dbDateTimeString);
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? 'one minute ago' : `${minutes} minutes ago`;
    } else {
        return 'just now';
    }
}

export function getUtcOffset(unixTimestamp){
    const date = new Date(unixTimestamp * 1000);
    // Get the timezone offset in minutes
    const offsetInMinutes = date.getTimezoneOffset(); 

    // Convert the offset to hours and minutes
    // const hours = Math.floor(Math.abs(offsetInMinutes) / 60);
    // const minutes = Math.abs(offsetInMinutes) % 60;

    const hours = Math.floor((offsetInMinutes) / 60);
    const minutes = (offsetInMinutes) % 60;

    // Determine if the offset is positive or negative
    // const sign = offsetInMinutes > 0 ? '-' : '+';

    return {
        'hours': parseInt(hours),
        'minutes': parseInt(minutes)
    };
}
