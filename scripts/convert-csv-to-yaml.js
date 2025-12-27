const fs = require("fs")
const path = require("path")

// Read CSV file
const csvPath = path.join(__dirname, "..", "Blockchain-Solana-AI-2026.csv")
const csvContent = fs.readFileSync(csvPath, "utf-8")

// Parse CSV
const lines = csvContent.split("\n").filter((line) => line.trim())
const headers = lines[0].split(",")

// Map continent names to valid values
const continentMap = {
  Africa: "africa",
  Asia: "asia",
  Europe: "europe",
  "North America": "north-america",
  "South America": "south-america",
  Oceania: "oceania",
  Global: "global",
  TBD: "global",
}

// Map event types
const typeMap = {
  Conference: "conference",
  "Conference + Hackathon": "conference",
  Hackathon: "hackathon",
  Meetup: "meetup",
  "Popup Village/City": "popup-village",
  Festival: "festival",
  "Conference + Hackathon + Festival": "festival",
  Workshop: "workshop",
  Summit: "summit",
}

// Map categories
const categoryMap = {
  Solana: "solana",
  Ethereum: "ethereum",
  "Ethereum DeFi": "ethereum",
  Bitcoin: "bitcoin",
  Blockchain: "blockchain",
  "AI Research": "ai",
  AI: "ai",
  Developer: "developer",
  Institutional: "institutional",
  "Institutional Blockchain": "institutional",
  "Institutional RWA": "institutional",
  "AI Blockchain": "ai",
  dApp: "ethereum",
  "dApp Ethereum": "ethereum",
  Web3: "web3",
  "BNB Chain": "blockchain",
  Cosmos: "blockchain",
  Privacy: "privacy",
  "Blockchain Privacy": "privacy",
  "Blockchain ZK": "zk",
  "Tech (Web3 Track)": "web3",
  "Fintech AI Blockchain": "blockchain",
}

// Create slug from event name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50)
}

// Parse a CSV line (handles quoted fields)
function parseCSVLine(line) {
  const result = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

// Escape YAML strings
function yamlString(str) {
  if (!str || str === "TBD") return null
  // If string contains special chars, quote it
  if (str.includes(":") || str.includes("#") || str.includes("'") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '\\"')}"`
  }
  return str
}

// Process each event
const events = []
for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i])
  if (values.length < 5) continue

  const [
    eventName,
    startDate,
    endDate,
    location,
    city,
    country,
    continent,
    type,
    category,
    attendance,
    description,
    website,
    twitter,
    telegram,
    discord,
    farcaster,
  ] = values

  // Skip if no valid start date
  if (!startDate || !startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    console.log(`Skipping event with invalid date: ${eventName} - ${startDate}`)
    continue
  }

  const slug = createSlug(eventName)
  const filename = `${startDate}_${slug}.yaml`

  // Build YAML content
  let yaml = ""
  yaml += `title: ${yamlString(eventName) || eventName}\n`
  yaml += `startDate: "${startDate}"\n`

  if (endDate && endDate !== startDate && endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    yaml += `endDate: "${endDate}"\n`
  }

  yaml += `url: ${website || "https://example.com"}\n`
  yaml += "\n"

  if (description) {
    yaml += `description: >\n  ${description}\n`
    yaml += "\n"
  }

  if (type && typeMap[type]) {
    yaml += `type: ${typeMap[type]}\n`
  }

  if (category) {
    const cats = category.split(" ").filter((c) => categoryMap[c] || categoryMap[category])
    const mappedCats = cats.length > 0 ? cats.map((c) => categoryMap[c] || categoryMap[category]).filter(Boolean) : []
    const uniqueCats = [...new Set(mappedCats.length > 0 ? mappedCats : [categoryMap[category]].filter(Boolean))]
    if (uniqueCats.length > 0) {
      yaml += `categories:\n`
      uniqueCats.forEach((c) => {
        yaml += `  - ${c}\n`
      })
    }
  }
  yaml += "\n"

  // Location
  if (city || country || continent) {
    yaml += `location:\n`
    if (city && city !== "TBD" && city !== "Online") {
      yaml += `  city: ${yamlString(city) || city}\n`
    } else if (city === "Online") {
      yaml += `  city: Online\n`
    }
    if (country && country !== "TBD" && country !== "Online") {
      yaml += `  country: ${yamlString(country) || country}\n`
    } else if (country === "Online") {
      yaml += `  country: Online\n`
    }
    if (continent && continentMap[continent]) {
      yaml += `  continent: ${continentMap[continent]}\n`
    }
  }
  yaml += "\n"

  if (attendance) {
    yaml += `attendance: "${attendance}"\n`
    yaml += "\n"
  }

  // Social links
  const hasSocial = twitter || telegram || discord || farcaster
  if (hasSocial) {
    yaml += `social:\n`
    if (twitter) yaml += `  twitter: ${twitter}\n`
    if (telegram) yaml += `  telegram: ${telegram}\n`
    if (discord) yaml += `  discord: ${discord}\n`
    if (farcaster) yaml += `  farcaster: ${farcaster}\n`
  }

  events.push({ filename, yaml, startDate })
}

// Write YAML files
const eventsDir = path.join(__dirname, "..", "events", "2026")
if (!fs.existsSync(eventsDir)) {
  fs.mkdirSync(eventsDir, { recursive: true })
}

events.forEach(({ filename, yaml }) => {
  const filePath = path.join(eventsDir, filename)
  fs.writeFileSync(filePath, yaml.trim() + "\n")
  console.log(`Created: ${filename}`)
})

console.log(`\nTotal events created: ${events.length}`)
