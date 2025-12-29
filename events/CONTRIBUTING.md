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

categories:                    # Event format (1-2 max)
  - conference
  - hackathon

tags:                          # Topic tags
  - ethereum
  - defi

location:
  venue: National Western Complex
  city: Denver
  country: USA
  continent: north-america     # See continents below

social:
  twitter: https://x.com/ethereumdenver
  telegram: https://t.me/Ethdenver
  discord: https://discord.gg/ethdenver
  farcaster: https://farcaster.xyz/ethdenver
```

### Categories

Event format (use 1-2):
- `conference` - talks, panels, expo
- `hackathon` - building competition
- `meetup` - casual networking
- `coworking` - shared workspace
- `popup-village` - multi-week co-living (Zuzalu-style)

### Tags

Topic tags (use 1-3):
- `ethereum`, `solana`, `bitcoin`, `blockchain`
- `ai`, `defi`, `privacy`, `zk`
- `institutional`, `developer`, `web3`, `rwa`

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

### Full Event (Conference + Hackathon)

```yaml
title: ETHDenver
startDate: "2026-02-17"
endDate: "2026-02-21"
url: https://ethdenver.com/

description: >
  World's largest Ethereum BUIDLathon with 25000+ innovators
  from 125+ countries.

categories:
  - conference
  - hackathon

tags:
  - ethereum

location:
  venue: National Western Complex
  city: Denver
  country: USA
  continent: north-america

social:
  twitter: https://x.com/ethereumdenver
  telegram: https://t.me/Ethdenver
```

### Minimal Event (Meetup)

```yaml
title: ETHGlobal Happy Hour Lisbon
startDate: "2026-01-06"
url: https://luma.com/event/xyz

categories:
  - meetup

tags:
  - ethereum

location:
  city: Lisbon
  country: Portugal
  continent: europe
```

### Online Event (Hackathon)

```yaml
title: HackMoney 2026
startDate: "2026-01-30"
endDate: "2026-02-11"
url: https://ethglobal.com/events/hackmoney2026

description: The largest DeFi hackathon with async virtual format.

categories:
  - hackathon

tags:
  - ethereum
  - defi

location:
  city: Online
  country: Online
  continent: global
```

### Popup Village

```yaml
title: ZuKas
startDate: "2026-04-10"
endDate: "2026-05-10"
url: https://www.zukas.city/

description: Month-long Web3 festival and popup village in scenic Turkish coastal town.

categories:
  - popup-village

tags:
  - web3
  - zk

location:
  city: Kaş
  country: Turkey
  continent: europe

social:
  twitter: https://x.com/zuzalukas
  telegram: https://t.me/zuzalukas
```

## Validation

Your event will be validated against the schema when the site builds. Common issues:

| Error | Fix |
|-------|-----|
| Invalid date format | Use `"YYYY-MM-DD"` with quotes |
| End date before start | Ensure `endDate >= startDate` |
| Invalid URL | Must start with `https://` |
| Invalid category | Check allowed values above |

## Questions?

See `events/_schema.yaml` for the full schema documentation.
