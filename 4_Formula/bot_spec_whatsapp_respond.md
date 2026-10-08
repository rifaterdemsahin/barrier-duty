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
- Barrier Duty Rota Data
- Runner Environment: Ubuntu VPS (Hermes)

## Destinations
- WhatsApp user chats (responses)
- Discord Channel Notifications (via `<WEBHOOK_URL>`)

## Operating rules
1. Never print or commit secrets (webhooks, API keys, tokens) to docs or repo.
2. Follow RULE-001 through RULE-005.
3. Keep specs documentation current.

## Constraints
- Runner: Must execute on the Ubuntu VPS (Hermes).
- All secrets from Azure Key Vault or agent memory.

## Change log
- 2026-10-08: Initial creation of the WhatsApp Support Bot spec.
