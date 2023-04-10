import React, { useEffect, useState } from "react";

import { padWithZeroes } from "@utils/formatDate";

type IProps = {
  targetDate: Date;
};

// custom countdown timer hook that return time left until target date every second
function useCountdown(targetDate: Date) {
  const countdownTime = targetDate.getTime(); // date in ms of when countdown ends

  const [countdown, setCountdown] = useState(countdownTime - Date.now()); // time left

  // start interval that will update remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdownTime - Date.now());
    }, 1000);

    return () => clearInterval(interval); // remove the interval when component leaves the screen
  }, [countdownTime]);

  let minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
  if (minutes < 0) {
    minutes++; // minutes are rounded up which is fine for positive numbers, but not for negative
  }
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

  return [minutes, seconds];
}

export default function Countdown(props: IProps) {
  const [minutes, seconds] = useCountdown(props.targetDate);

  return (
    <p className="countdown" role="timer">
      {padWithZeroes(minutes)}:{padWithZeroes(seconds)}
    </p>
  );
}
