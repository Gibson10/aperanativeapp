import moment from "moment";
export function timeDifference  (endtime, starttime) {
    // console.log(endtime, starttime)
var date1 = new Date(endtime);
var date2 = new Date(starttime);
// console.log(date1);
// console.log(date2);
var diff = date1.getTime() - date2.getTime();
console.log("diff in seconds", diff);
var msec = diff;
var hh = Math.floor(msec / 1000 / 60 / 60);
msec -= hh * 1000 * 60 * 60;
var mm = Math.floor(msec / 1000 / 60);
msec -= mm * 1000 * 60;
var ss = Math.floor(msec / 1000);
msec -= ss * 1000;
var converted_sec=mm/60
var converted_time=Math.round((hh +converted_sec)*100)/100
console.log("converted_time",converted_time);
// Math.round((0.1 + 0.2) * 1e12) / 1e12

// alert(hh + ":" + mm + ":" + ss);
return {hours:converted_time ,time:hh + " hours" + "  " +mm + "minutes"};
}


// var startDate = new Date();
// // Do your operations
// var endDate   = new Date();
// var seconds = (endDate.getTime() - startDate.getTime()) / 1000;