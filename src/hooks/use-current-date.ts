import { useEffect, useState } from "react";

type CurrentDate = {
  dateTime: string;
  label: string;
  compactLabel: string;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const compactWeekdayFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
});

const compactDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatCurrentDate(date: Date): CurrentDate {
  const formattedLabel = dateFormatter.format(date);
  const compactWeekday = compactWeekdayFormatter.format(date).replace(".", "");

  return {
    dateTime: [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-"),
    label: formattedLabel.charAt(0).toLocaleUpperCase("pt-BR") + formattedLabel.slice(1),
    compactLabel: `${compactWeekday}, ${compactDateFormatter.format(date)}`,
  };
}

/**
 * Mantém a data em sincronia com o calendário local do usuário. O primeiro
 * render é neutro para evitar divergência entre servidor e navegador; depois,
 * a atualização é agendada exatamente para a próxima virada de dia.
 */
export function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState<CurrentDate>(() => formatCurrentDate(new Date()));

  useEffect(() => {
    let midnightTimer: number;

    const updateAndSchedule = () => {
      const now = new Date();
      setCurrentDate(formatCurrentDate(now));

      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
      midnightTimer = window.setTimeout(updateAndSchedule, nextMidnight.getTime() - now.getTime());
    };

    updateAndSchedule();
    return () => window.clearTimeout(midnightTimer);
  }, []);

  return currentDate;
}
