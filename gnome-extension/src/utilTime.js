
function timeConvert(n) {
  var num = n;
  var hours = (num / 60);
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return {
    hours: rhours, minutes: rminutes
  }
}
function timeConvertLabel(minutes) {
  const converted = timeConvert(minutes)
  return `${converted.hours}h ${converted.minutes}`
}

const weekDays = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
]

module.exports = {
  timeConvert,
  timeConvertLabel,
  weekDays,
}