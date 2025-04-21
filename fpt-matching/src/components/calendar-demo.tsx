'use client'

import {useEffect, useState} from 'react'
import Calendar from './calendar/calendar'
import { CalendarEvent, Mode } from './calendar/calendar-types'
import {reviewService} from "@/services/review-service";
import {EVENT_COLORS} from "@/lib/mock-calendar-events";
import {useSelectorUser} from "@/hooks/use-auth";
interface TimeCalculation {
  start: Date
  end: Date
}
function createTimeSlot(
    {
      dateEvent,
      slot
    }: {
      dateEvent: Date
      slot: number
    }
): TimeCalculation {

  console.log(dateEvent)
  const start = new Date(dateEvent);
  const end = new Date(dateEvent);

  switch (slot) {
    case 1: {
      start.setHours(7, 0, 0, 0);
      end.setHours(9, 15, 0, 0);
      break;
    }
    case 2: {
      start.setHours(9, 30, 0, 0);
      end.setHours(11, 45, 0, 0);
      break;
    }
    case 3: {
      start.setHours(12, 30, 0, 0);
      end.setHours(14, 45, 0, 0);
      break;
    }
    case 4: {
      start.setHours(15, 0, 0, 0);
      end.setHours(17, 15, 0, 0);
      break;
    }
    case 5: {
      start.setHours(17, 45, 0, 0);
      end.setHours(20, 0, 0, 0);
    }
  }


  return { start, end };
}


export default function CalendarDemo() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [mode, setMode] = useState<Mode>('month')
  const [date, setDate] = useState<Date>(new Date())
  const user = useSelectorUser()

  useEffect(() => {
    const fetchEvent = async () => {
      if (!user) {
        return;
      }
      const response = await reviewService.getReviewByReviewerId({
        reviewerId: user.id!
      });

      if (response.data) {
        const newEvents = response.data.map(review => {
          const date = new Date(Date.parse(review.reviewDate!));
          const dateEvent = new Date(date.getTime());
          const { start, end } = createTimeSlot({
            slot: review.slot!,
            dateEvent
          });

          return {
            id: review.id!,
            start,
            end,
            color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
            title: review.project?.topic.topicCode
          } as CalendarEvent;
        });

        setEvents(newEvents);
      }
    };

    fetchEvent();
  }, []);
  console.log(events)
  return (
    <Calendar
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
    />
  )
}
