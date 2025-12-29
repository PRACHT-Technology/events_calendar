# Crypto & AI Events Calendar

A community-driven calendar for blockchain, Ethereum, Solana, and AI events worldwide. Browse conferences, hackathons, meetups, and more.

**Live:** [events.pracht.tech](https://events.pracht.tech)

## Features

- Browse 50+ crypto and AI events for 2026
- Filter by category (Ethereum, Solana, Bitcoin, AI, DeFi, etc.)
- View event details, locations, and social links
- Responsive calendar interface
- SEO-optimized with structured data

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/PLACEHOLDER/events-calendar.git
cd events-calendar

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the calendar.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
events_calendar/
├── app/                    # Next.js app router pages
├── components/             # React components
├── events/                 # Event data (YAML files)
│   ├── _schema.yaml        # Schema documentation
│   └── 2026/               # Events by year
│       └── YYYY-MM-DD_event-slug.yaml
├── lib/                    # Utilities and helpers
└── types/                  # TypeScript types
```

## Contributing

We welcome contributions from the community! There are several ways to help:

### Adding a New Event

1. Create a new YAML file in `events/YYYY/` with the naming format:
   ```
   YYYY-MM-DD_event-slug.yaml
   ```

2. Use this template:
   ```yaml
   title: Event Name
   startDate: "2026-03-15"
   endDate: "2026-03-17"        # Optional, omit for single-day events
   url: https://event-website.com/

   description: >
     Brief description of the event (1-2 sentences).

   categories:
     - ethereum                 # Primary category (determines color)
     - defi                     # Additional categories

   location:
     city: Berlin
     country: Germany
     continent: europe          # africa, asia, europe, north-america, south-america, oceania, global

   social:                      # Optional
     twitter: https://x.com/eventhandle
     telegram: https://t.me/eventgroup
   ```

3. Submit a pull request

### Available Categories

| Category | Color |
|----------|-------|
| ethereum | `#627EEA` |
| solana | `#14F195` |
| bitcoin | `#F7931A` |
| blockchain | `#3B82F6` |
| ai | `#8B5CF6` |
| defi | `#10B981` |
| privacy | `#6366F1` |
| institutional | `#0EA5E9` |
| developer | `#F59E0B` |
| zk | `#EC4899` |
| web3 | `#06B6D4` |
| rwa | `#84CC16` |

### Other Contributions

- **Report bugs** - Open an issue on GitHub
- **Suggest features** - Open an issue describing the feature
- **Improve documentation** - Submit a PR with updates
- **Fix issues** - Check open issues and submit PRs

### Development Guidelines

- Follow the existing code style
- Test your changes locally before submitting
- Keep PRs focused on a single change
- Write clear commit messages

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [YAML](https://yaml.org/) - Event data format

## License

MIT

## Maintainers

Maintained by [PRACHT Technology](https://pracht.tech)

---

Found a missing event? [Open a PR](https://github.com/PLACEHOLDER) or [create an issue](https://github.com/PLACEHOLDER/issues)!
