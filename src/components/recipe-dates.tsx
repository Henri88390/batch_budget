"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { dateLabel as formatDate } from "@/lib/plan";
import { Icon } from "./icons";
import { Localize, useI18n } from "./display-settings";

export function RecipeDates({ dates, title }: { dates: string[]; title: string }) {
  const { locale } = useI18n();
  const dateLabel = (key: string) => formatDate(key, undefined, locale);
  const list = useRef<HTMLUListElement>(null);
  const [visibleCount, setVisibleCount] = useState(dates.length);

  useLayoutEffect(() => {
    const element = list.current;
    if (!element) return;
    const measure = () => {
      const chips = Array.from(element.querySelectorAll<HTMLElement>(".recipe-date"));
      const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
      const widths = chips.map((chip) => chip.getBoundingClientRect().width);
      const total = widths.reduce((sum, width) => sum + width, 0) + gap * Math.max(0, widths.length - 1);
      if (total <= element.clientWidth) {
        setVisibleCount(dates.length);
        return;
      }
      const more = element.querySelector<HTMLElement>(".recipe-dates-more")!;
      const available = element.clientWidth - more.getBoundingClientRect().width - gap;
      let used = 0;
      let count = 0;
      for (const width of widths) {
        const next = used + (count ? gap : 0) + width;
        if (next > available) break;
        used = next;
        count++;
      }
      setVisibleCount(count);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [dates, locale]);

  return <Localize><ul ref={list} className="recipe-dates" aria-label={`Planned dates for ${title}`}>
    {dates.map((date, index) => <li className={`recipe-date${index >= visibleCount ? " recipe-date-hidden" : ""}`} aria-hidden={index >= visibleCount} key={date}>
      <Icon name="calendar" size={12} /><time dateTime={date}>{dateLabel(date)}</time>
    </li>)}
    <li className={`recipe-dates-more${visibleCount === dates.length ? " recipe-date-hidden" : ""}`} aria-hidden={visibleCount === dates.length} aria-label={`${dates.length - visibleCount} more occurrences`} title={dates.map((date) => dateLabel(date)).join(", ")}>...</li>
  </ul></Localize>;
}
