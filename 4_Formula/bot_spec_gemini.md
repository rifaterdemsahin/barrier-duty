# 🤖 Bot Spec - Gemini

Version: 1.0
Last updated: 2026-10-08
Agent id: antigravity-gemini-3.1-pro

## Purpose
Gemini agent for the barrier-duty project, assisting with complex coding, refactoring, and AI harness task execution.

## Success criteria
- Successfully refactors and maintains the delivery-pilot-template framework.
- Executes tasks packet files cleanly.

## Context
- Owner: Rifat Erdem Sahin
- Agent display name: Gemini (Antigravity)

## Data sources / tools
- Gemini 3.1 Pro (High)
- MCP Tools, Bash execution, filesystem access.

## Destinations
- barrier-duty GitHub repository.

## Operating rules
1. Never print or commit secrets to docs or repo.
2. Follow RULE-001 through RULE-005.
3. Keep specs documentation current.

## Constraints
- Local development server on ports over 30,000.
- All secrets from Azure Key Vault.

## Change log
- 2026-10-08: Initial creation.
