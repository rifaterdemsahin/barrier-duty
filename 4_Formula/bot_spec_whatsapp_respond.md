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
- When volunteers request changes via WhatsApp, the bot parses the request, formats the updated rota schedule as a JSON array, and uploads it to the Azure Blob Container (`rota.json`).
- The frontend static site natively fetches this `rota.json` from the public Azure Blob URL, decoupling the static site from requiring an active backend to render the schedule.
- **Frontend References:** The live app is hosted on Fly.io at [https://barrier-duty-v1.fly.dev/](https://barrier-duty-v1.fly.dev/). All updates made by the bot to Azure Storage are instantly reflected on the live site upon page refresh.

## Update Flow & Human-in-the-Loop (HITL) Process
1. **Update Trigger:** A volunteer messages the WhatsApp bot to request a shift change or cancelation.
2. **Bot Assessment:** The bot analyzes the request. If the request is straightforward (e.g., swapping a shift with an available slot), the bot stages the updated JSON.
3. **HITL Review:** Before committing critical updates to Azure Blob Storage, the bot formats the proposed change and sends a confirmation message to the Admin Discord channel via webhook (`https://discord.com/api/webhooks/1557842475597561896/...`). 
4. **Approval / Intervention:** A human administrator reviews the Discord notification. If approved, the bot finalizes the upload to Azure. If the bot is unsure, it alerts the human admin to intervene directly via WhatsApp or by manually editing the JSON via the [Admin Dashboard Rota Editor](https://barrier-duty-v1.fly.dev/#admin).
5. **Confirmation:** The bot messages the volunteer back confirming the change.

## Security Definition
- **Data Protection:** No plaintext volunteer phone numbers or personal PII are stored in the public `rota.json` file.
- **Secrets Management:** The Azure Storage connection strings and Discord Webhook URLs are explicitly excluded from source control. They are fetched securely at runtime from Azure Key Vault.
- **Access Control:** The admin dashboard is password-protected (`3579>`), utilizing client-side hash verification to restrict access to the manual JSON editor.
- **Platform:** The bot must execute strictly within the isolated Ubuntu VPS (Hermes).

## Training & Adaptation
- **Continuous Learning:** The bot logs ambiguous WhatsApp messages and failed shift requests to a separate "training bucket" (Axiom or a secure log file). 
- **Prompt Refinement:** On a weekly basis, the administrative team reviews these edge cases to refine the bot's NLP parsing rules, improving its ability to understand colloquial volunteer messages (e.g., "I can't make it tomoroz").
- **Dynamic Policy Adaptation:** As project rules evolve (e.g., adding a new "School Street" policy), the bot's system prompts are updated to relay the newest documentation (like linking to the `what_is_a_school_street.md` page).

## Constraints
- Runner: Must execute on the Ubuntu VPS (Hermes).
- All secrets from Azure Key Vault or agent memory.

## Change log
- 2026-10-08: Added Fly.io integration links, detailed the human-in-the-loop (HITL) update process, and formalized security and training/adaptation protocols.
