"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Copy } from "@phosphor-icons/react"
import { toast } from "sonner"

const endpoints = [
  { path: "/api/events", description: "All events" },
  { path: "/api/events?year=2026", description: "Events for a specific year" },
  { path: "/api/events?year=2026&month=01", description: "Events for a specific month" },
]

export function ApiDocsPopover() {
  const copyToClipboard = (path: string) => {
    const fullUrl = `${window.location.origin}${path}`
    navigator.clipboard.writeText(fullUrl)
    toast.success("Copied to clipboard", { description: fullUrl })
  }

  return (
    <Dialog>
      <DialogTrigger className="hover:text-foreground transition-colors">
        API
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Events API</DialogTitle>
          <DialogDescription>
            Click an endpoint to copy the full URL.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 font-mono">
          {endpoints.map((endpoint) => (
            <button
              key={endpoint.path}
              onClick={() => copyToClipboard(endpoint.path)}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors group text-left"
            >
              <Copy className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">GET {endpoint.path}</div>
                <div className="text-xs text-muted-foreground">{endpoint.description}</div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
