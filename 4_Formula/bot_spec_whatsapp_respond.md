# 🤖 Bot Spec - WhatsApp Respond

Version: 1.0
Last updated: 2026-10-08
Agent Role: Support
Domain: WhatsApp
Topic: Coordinate Rota

## Purpose
A WhatsApp auto-responder and coordination bot for the barrier-duty project. It handles volunteer support and coordinates the crossing guard rota.

## Success criteria
- Promptly responds to WhatsApp messages regarding the volunteer rota.
- Relays important updates and status changes to the team Discord channel.
- Runs reliably on the designated VPS runner.

## Context
- Owner: Rifat Erdem Sahin
- Agent display name: WhatsApp Responder

## Data sources / tools
- WhatsApp Business API / Web automation
- Barrier Duty Rota Data (Azure Blob Storage: `rota.json`)
- Runner Environment: Ubuntu VPS (Hermes)

## Destinations
- WhatsApp user chats (responses)
- Discord Channel Notifications (via `<WEBHOOK_URL>`)

## Operating rules
1. Never print or commit secrets (webhooks, API keys, tokens) to docs or repo.
2. Follow RULE-001 through RULE-005.
3. Keep specs documentation current.

## Technical Integration (Rota Updates)
- The bot retrieves the `AZURE_STORAGE_CONNECTION_STRING` from the `dp-kv-deliverypilot` Azure Key Vault.
- The bot parses WhatsApp messages regarding shift changes, formats the updated rota schedule as a JSON array, and uploads it to the Azure Blob Container (`rota.json`).
- The frontend static site natively fetches this `rota.json` from the public Azure Blob URL, decoupling the static site from requiring an active backend to render the schedule.

## Constraints
- Runner: Must execute on the Ubuntu VPS (Hermes).
- All secrets from Azure Key Vault or agent memory.

## Change log
- 2026-10-08: Initial creation of the WhatsApp Support Bot spec.
