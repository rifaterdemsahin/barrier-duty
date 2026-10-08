# 🤖 Bot Spec - Barrier Duty

> **Stage 4: Formula** — The bot-spec format for the Barrier Duty bot. 

Version: 1.2
Last updated: 2026-10-08 (Europe/London)

## Purpose

The Barrier Duty bot assists with automating the volunteer rota updates, managing volunteer communications, maintaining the school street barrier duty website data, and actively listening to channel conversations to build the rota and announce weekly gaps.

## Success criteria

- Rota updates are processed and applied accurately to the Azure Blob Storage via the Fly.io API.
- The website (https://barrier-duty-v1.fly.dev/) reflects the updated data accurately.
- Human-in-the-loop is maintained for critical changes.
- High security standards are observed, with credentials securely retrieved from Azure Key Vault.
- The bot accurately captures volunteer availability from channel conversations and correctly mentions weekly rota gaps.

## Context

- Owner: Rifat Erdem Sahin (Europe/London)
- Agent display name: BarrierDuty Bot
- Execution environment: Local / Cloud Agent Workspace
- Primary Deployment URL: https://barrier-duty-v1.fly.dev/

## Data sources / tools

- Azure Key Vault (`dp-kv-deliverypilot`) for retrieving secrets (`ADMIN-PASSWORD`, `AZURE-STORAGE-CONNECTION-STRING`).
- Azure Blob Storage (`dpstoragebarrierduty` -> `config`, `rota` containers) for dynamic data.
- Fly.io backend API (`https://barrier-duty-v1.fly.dev/api/data/<entity>`) to load and save `rota`, `volunteers`, and `updates` json files.
- GitHub (`rifaterdemsahin/barrier-duty`) for source code management.
- Messaging Channels (e.g., Slack, WhatsApp, or Discord) to monitor conversations for volunteer availability.

## Destinations

- The primary web interface at Fly.io: https://barrier-duty-v1.fly.dev/
- Local fallbacks and development environments.
- Azure Storage Blob (updating `rota.json`, `updates.json`, `volunteers.json`).
- Messaging Channels (posting weekly rota gap mentions).

## Operating rules

1. **Security**: Never print or commit secrets (passwords, connection strings) in the repository or logs. Use Azure Key Vault exclusively. The `ADMIN-PASSWORD` is `3579`.
2. **Updates Workflow**: When the bot updates the rota, it reads the current JSON from the Azure Blob Storage via the API, applies changes based on user prompts, and POSTs the updated JSON back to the Fly.io API.
3. **Continuous Deployment**: Code updates are pushed to the `main` branch and deployed to Fly.io automatically via GitHub Actions (if configured) or via `fly deploy`.

## Automation / routines

- **Channel Listening**: The bot continuously monitors the designated volunteer chat channel for availability messages (e.g., "I can do Tuesday morning") and parses them to build the rota.
- **Weekly Gap Mentions**: At a designated time each week (e.g., Sunday evening), the bot checks the rota for the upcoming week and posts a mention in the channel highlighting any remaining gaps.
- **Data Updates**: The bot can run periodic checks to ensure the rota is populated for upcoming weeks.
- **Config Sync**: The bot can sync local `navigation_config.json` with the Azure Blob Storage.

## Human-in-the-loop Process

1. **Proposed Changes**: The bot calculates the new rota or updates based on availability and proposes it.
2. **Review**: The human admin reviews the proposed JSON or UI preview.
3. **Approval**: The human admin can either approve the bot to commit the changes or log in manually to the Admin interface on https://barrier-duty-v1.fly.dev/ to manually edit the `rota.json` via the web editor using the admin password (`3579`).
4. **Escalation**: Any failures in API communication or data inconsistencies are flagged for manual admin intervention.

## Training & Adaptation

- **Training**: The bot uses historical `rota.json` data to understand common volunteer patterns and preferred shifts. It reads `volunteers.json` to respect constraints.
- **Adaptation**: As the human admin manually overrides shifts via the website's Admin editor (using the date picker and volunteer dropdown checklist), the bot learns from the latest state (whether in Azure Blob Storage or fallback local JSONs) and adapts its future proposals to minimize conflicting assignments.

## Business Rules

1. **Shift Schedule**: Rotas are strictly scheduled from Monday to Friday. Weekends are excluded.
2. **Shift Structure**: Each day has a Morning shift (e.g., 08:00-08:30) and an Afternoon shift (e.g., 15:00-15:30).
3. **Capacity Requirements**: Each shift requires exactly two volunteers (`volunteer1` and `volunteer2`).
4. **Gap Identification**: If a shift slot cannot be filled by an available volunteer, the slot must be assigned the exact value `"STANDBY NEEDED"`.
5. **Availability Matching**: Volunteers must only be assigned to shifts that match their recorded availability.
6. **Data Fallback Lifecycle**: Data is fetched primarily from the Fly.io API, falling back to direct Azure Blob Storage endpoints, and finally defaulting to local JSON repository files (`5_Symbols/rota.json`) if cloud sources fail.

## Entity, Attribute, and Attribute Types

### 1. RotaEntry
Represents a specific shift in the volunteer schedule.
- `date` *(String)*: The calendar date in `YYYY-MM-DD` format (handled via date picker in UI).
- `day` *(String)*: The day of the week (e.g., "Monday").
- `time` *(String)*: The time span of the shift (e.g., "08:00-08:30").
- `shift` *(String)*: Shift category ("morning" or "afternoon").
- `volunteer1` *(String)*: The assigned volunteer's name, or `"STANDBY NEEDED"`.
- `volunteer2` *(String)*: The assigned volunteer's name, or `"STANDBY NEEDED"`.

### 2. Volunteer
Represents a recorded volunteer and their availability.
- `name` *(String)*: The volunteer's full name.
- `total_shifts` *(Integer)*: Count of total shifts the volunteer has completed.
- `availability` *(String)*: Textual description of when they can volunteer (e.g., "Monday & Friday mornings").

### 3. Update
Represents a news or announcement item for the website.
- `date` *(String)*: The date of the update (e.g., "Oct 24, 2026").
- `title` *(String)*: Headline of the update.
- `content` *(String)*: Full text content of the announcement.
- `urgent` *(Boolean)*: Flag indicating if the update is critical/high-priority.

## Constraints

- Only update data via the authenticated Fly.io backend endpoints or directly to Azure Storage with Key Vault credentials.
- Do not bypass the human-in-the-loop process for generating new month schedules.
- Always use the predefined volunteer checklist to prevent naming typos when updating the rota.

## Change log

- 2026-10-08: Version 1.2 updated. Added business rules, defined entity attribute types, and incorporated UI/system learnings (date pickers, dropdowns, and data fallback lifecycle).
- 2026-10-08: Version 1.1 created. Added Fly.io links, updated data sources, defined human-in-the-loop process, and detailed security & training rules.
