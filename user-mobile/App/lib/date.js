export function timeSince(_date) {
  // console.log(date);
  const date = new Date(_date);
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;
  if (interval > 1) {
    return dateStringWithYear(date);
  }

  interval = seconds / 86400;
  if (interval > 1) {
    const days = Math.floor(interval) + " days";
    if (days === "1 days") {
      return "yesterday";
    } else if (days < 5) {
      return days + " ago";
    } else {
      return dateStringWithoutYear(date);
    }
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

const dateStringWithYear = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const dateStringWithoutYear = (date) => {
  const options = { month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};
