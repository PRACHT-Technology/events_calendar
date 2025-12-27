"use client"

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ApiDocsPopover() {
  return (
    <Popover>
      <PopoverTrigger className="hover:text-foreground transition-colors">
        API
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Events API</PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col gap-2 font-mono">
          <div>
            <div className="text-muted-foreground">GET /api/events</div>
            <div className="text-[10px] text-muted-foreground/70">All events</div>
          </div>
          <div>
            <div className="text-muted-foreground">GET /api/events?year=2026</div>
            <div className="text-[10px] text-muted-foreground/70">Events for a specific year</div>
          </div>
          <div>
            <div className="text-muted-foreground">GET /api/events?year=2026&month=01</div>
            <div className="text-[10px] text-muted-foreground/70">Events for a specific month</div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
