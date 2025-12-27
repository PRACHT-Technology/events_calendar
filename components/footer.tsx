import { XLogo } from "@phosphor-icons/react/dist/ssr"
import { ContributeDialog } from "./contribute-dialog"
import { ApiDocsPopover } from "./api-docs-popover"

export function Footer() {
  return (
    <footer className="flex-shrink-0 bg-background/80 backdrop-blur-sm border-t border-border">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <ContributeDialog />
          <ApiDocsPopover />
        </div>

        <span>
          Open Source maintained by{" "}
          <a
            href="https://pracht.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            PRACHT Technology
          </a>
        </span>

        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
          aria-label="Follow on X"
        >
          <XLogo className="h-4 w-4" weight="fill" />
        </a>
      </div>
    </footer>
  )
}
