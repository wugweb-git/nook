import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { formatDate, formatTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface EventsWidgetProps {
  limit?: number;
}

export default function EventsWidget({ limit = 3 }: EventsWidgetProps) {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });
  
  const upcomingEvents = events 
    ? events
        .filter(event => new Date(event.startDate) > new Date())
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, limit)
    : [];
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-24" />
        </div>
        
        <div className="space-y-3">
          {Array(limit).fill(0).map((_, i) => (
            <div key={i} className="flex p-2">
              <Skeleton className="w-12 h-12 rounded mr-3" />
              <div>
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading font-medium">Upcoming Events</h4>
        <Button variant="ghost" size="sm" className="text-primary text-sm font-medium">
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Event
        </Button>
      </div>
      
      {upcomingEvents.length > 0 ? (
        <div className="space-y-3">
          {upcomingEvents.map((event) => {
            const eventDate = new Date(event.startDate);
            const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
            const day = eventDate.getDate();
            
            return (
              <div key={event.id} className="flex p-2 hover:bg-neutral-lightest rounded-md transition-colors">
                <div className="w-12 h-12 bg-primary-light bg-opacity-10 rounded flex flex-col items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-xs font-medium text-primary">{month}</span>
                  <span className="text-sm font-bold text-primary">{day}</span>
                </div>
                <div>
                  <h5 className="text-sm font-medium">{event.title}</h5>
                  <p className="text-xs text-neutral-medium">
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      event.category === "Marketing Department" ? "bg-primary" :
                      event.category === "Performance Review" ? "bg-warning" :
                      "bg-success"
                    } mr-1`}></span>
                    <span className="text-xs text-neutral-medium">{event.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-neutral-medium">
          <p>No upcoming events</p>
        </div>
      )}
    </div>
  );
}
