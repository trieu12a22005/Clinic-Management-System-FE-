import { useEffect, useMemo, useState } from "react";

function DateTimeNow() {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const dateText = useMemo(() => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(now);
  }, [now]);

  const timeText = useMemo(() => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);
  }, [now]);

  return (
    <div className="flex items-center gap-1 text-[16px] text-black">
      <span className="font-light">Bây giờ là</span>
      <span>{timeText}</span>
      <span className="font-light">, ngày</span>
      <span>{dateText}</span>
    </div>
  );
}

export default DateTimeNow;
