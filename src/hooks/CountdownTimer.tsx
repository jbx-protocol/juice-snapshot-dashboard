import { useState, useEffect } from "react";

const formatTimer = (delta: number) => {
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  const seconds = Math.floor(delta % 60);
  const daysText = `${days} ${days === 1 ? "day" : "days"}`;
  const hoursText = `${hours} ${hours === 1 ? "hour" : "hours"}`;
  const minutesText = `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  const secondsText = `${seconds} ${seconds === 1 ? "second" : "seconds"}`;

  return `${daysText}, ${hoursText}, ${minutesText}, ${secondsText}`;
};

export default function useCountdownTimer({ end }: { end?: number } = {}) {
  const [delta, setDelta] = useState<number>();

  useEffect(() => {
    if (!end) return;

    const interval = setInterval(() => {
      const _delta = Math.abs(end * 1000 - Date.now()) / 1000;
      setDelta(_delta);
    }, 1000);
    return () => clearInterval(interval);
  }, [end]);

  return delta ? formatTimer(delta) : undefined;
}
