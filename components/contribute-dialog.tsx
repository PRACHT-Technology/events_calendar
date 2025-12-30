"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { GitPullRequest, GithubLogo, XLogo } from "@phosphor-icons/react"

export function ContributeDialog() {
  return (
    <Dialog>
      <DialogTrigger className="hover:text-foreground transition-colors">
        Add Event
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to Contribute</DialogTitle>
          <DialogDescription>
            You can add a new event to the calendar by one of the following methods:
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <a
            href="https://github.com/PRACHT-Technology/events_calendar/pulls"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors group"
          >
            <GitPullRequest className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <div className="font-medium text-sm">Open a Pull Request</div>
              <div className="text-xs text-muted-foreground">
                Submit a pull request to add the event to the calendar
              </div>
            </div>
          </a>
          <a
            href="https://github.com/PRACHT-Technology/events_calendar/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors group"
          >
            <GithubLogo className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <div className="font-medium text-sm">Open an Issue</div>
              <div className="text-xs text-muted-foreground">
                Report a bug or suggest a feature or new event
              </div>
            </div>
          </a>
          <a
            href="https://twitter.com/intent/tweet?text=Please%20Add%20Event%20XYZ%20to%20events.pracht.tech%20%40deinjoni&url=https://events.pracht.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors group"
          >
            <XLogo className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <div className="font-medium text-sm">Tweet about the calendar</div>
              <div className="text-xs text-muted-foreground">
                Share feedback on X/Twitter about the calendar or request a new event
              </div>
            </div>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
