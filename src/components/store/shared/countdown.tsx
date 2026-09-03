import { useEffect, useState } from "react";

interface PropsType {
  targetDate: string; // Target date in a string format (e.g., "2024-12-31T23:59:59")
}

function Countdown({ targetDate }: PropsType) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetTime = new Date(targetDate).getTime();
    const calculatetTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculatetTimeLeft, 1000);

    // Initial calculation to avoid delay
    calculatetTimeLeft();

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="leading-4">
      <div className="relative">
        <span className="">Ends in:</span>
        <div className="flex gap-1 absolute">
          <span className="bg-primary-mid text-secondary-foreground w-6 aspect-square p-1 rounded-[2px] inline-flex justify-center items-center">
            {timeLeft.days.toString().padStart(2, "0")}
          </span>
          <span className="mx-1">:</span>
          <span className="bg-primary-mid text-secondary-foreground w-6 aspect-square p-1 rounded-[2px] inline-flex justify-center items-center">
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <span className="mx-1">:</span>
          <span className="bg-primary-mid text-secondary-foreground w-6 aspect-square p-1 rounded-[2px] inline-flex justify-center items-center">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="mx-1">:</span>
          <span className="bg-primary-mid text-secondary-foreground w-6 aspect-square p-1 rounded-[2px] inline-flex justify-center items-center">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Countdown;
