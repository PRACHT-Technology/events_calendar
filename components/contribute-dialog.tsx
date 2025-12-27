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
        Contribute
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to Contribute</DialogTitle>
          <DialogDescription>
            Choose how you&apos;d like to contribute to this project.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <a
            href="https://github.com/PLACEHOLDER"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors group"
          >
            <GitPullRequest className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <div className="font-medium text-sm">Open a Pull Request</div>
              <div className="text-xs text-muted-foreground">
                Contribute code directly via GitHub
              </div>
            </div>
          </a>
          <a
            href="https://github.com/PLACEHOLDER/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors group"
          >
            <GithubLogo className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <div className="font-medium text-sm">File an Issue</div>
              <div className="text-xs text-muted-foreground">
                Report bugs or suggest features
              </div>
            </div>
          </a>
          <a
            href="https://x.com/PLACEHOLDER"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors group"
          >
            <XLogo className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <div className="font-medium text-sm">Comment on Tweet</div>
              <div className="text-xs text-muted-foreground">
                Share feedback on X/Twitter
              </div>
            </div>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
