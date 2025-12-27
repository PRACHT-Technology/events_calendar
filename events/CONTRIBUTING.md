# Contributing Events

Thank you for contributing to the events calendar! This guide explains how to add new events.

## Quick Start

1. Fork the repository
2. Create a new YAML file in `events/YYYY/` (where YYYY is the event year)
3. Name the file: `YYYY-MM-DD_event-slug.yaml`
4. Fill in the required fields
5. Submit a pull request

## File Naming

**Pattern:** `YYYY-MM-DD_event-slug.yaml`

- Use the event **start date** as the prefix
- Use lowercase letters, numbers, and hyphens only in the slug
- Maximum 50 characters for the slug

**Examples:**
```
2026-02-17_ethdenver.yaml
2026-03-30_ethcc.yaml
2026-11-15_solana-breakpoint.yaml
```

## Required Fields

Every event file must have these 3 fields:

```yaml
title: Your Event Name
startDate: "2026-02-17"
url: https://your-event-website.com/
```

| Field | Format | Example |
|-------|--------|---------|
| `title` | Plain text (max 100 chars) | `ETHDenver` |
| `startDate` | YYYY-MM-DD | `"2026-02-17"` |
| `url` | HTTPS URL | `https://ethdenver.com/` |

## Optional Fields

Add these to provide more context:

```yaml
endDate: "2026-02-21"          # For multi-day events

description: >
  Brief description of the event (max 500 chars).

type: conference               # See types below
categories:                    # See categories below
  - ethereum
  - defi

location:
  venue: National Western Complex
  city: Denver
  country: USA
  continent: north-america     # See continents below

attendance: "25000+"           # Expected attendees

social:
  twitter: https://x.com/ethereumdenver
  telegram: https://t.me/Ethdenver
  discord: https://discord.gg/ethdenver
  farcaster: https://farcaster.xyz/ethdenver

tags:
  - hackathon
  - builders
```

### Event Types

Use one of:
- `conference`
- `hackathon`
- `meetup`
- `popup-village`
- `festival`
- `workshop`
- `summit`

### Categories

Use one or more of (first determines color):
- `ethereum` (purple)
- `solana` (green)
- `bitcoin` (orange)
- `blockchain` (blue)
- `ai` (violet)
- `defi` (emerald)
- `privacy` (indigo)
- `institutional` (cyan)
- `developer` (amber)
- `zk` (pink)
- `web3` (teal)
- `rwa` (lime)

### Continents

Use one of:
- `africa`
- `asia`
- `europe`
- `north-america`
- `south-america`
- `oceania`
- `global` (for online/virtual events)

## Examples

### Full Event (Conference)

```yaml
title: ETHDenver
startDate: "2026-02-17"
endDate: "2026-02-21"
url: https://ethdenver.com/

description: >
  World's largest Ethereum BUIDLathon with 25000+ innovators
  from 125+ countries.

type: conference
categories:
  - ethereum
  - defi

location:
  venue: National Western Complex
  city: Denver
  country: USA
  continent: north-america

attendance: "25000+"

social:
  twitter: https://x.com/ethereumdenver
  telegram: https://t.me/Ethdenver

tags:
  - buidlathon
  - hackathon
```

### Minimal Event (Meetup)

```yaml
title: ETHGlobal Happy Hour Lisbon
startDate: "2026-01-06"
url: https://luma.com/event/xyz

type: meetup
categories:
  - ethereum

location:
  city: Lisbon
  country: Portugal
  continent: europe
```

### Online Event

```yaml
title: HackMoney 2026
startDate: "2026-01-30"
endDate: "2026-02-11"
url: https://ethglobal.com/events/hackmoney2026

description: The largest DeFi hackathon with async virtual format.

type: hackathon
categories:
  - ethereum
  - defi

location:
  city: Online
  country: Online
  continent: global

attendance: "5000+"
```

## Validation

Your event will be validated against the schema when the site builds. Common issues:

| Error | Fix |
|-------|-----|
| Invalid date format | Use `"YYYY-MM-DD"` with quotes |
| End date before start | Ensure `endDate >= startDate` |
| Invalid URL | Must start with `https://` |
| Invalid type/category | Check allowed values above |

## Questions?

See `events/_schema.yaml` for the full schema documentation.
