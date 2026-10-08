# 🏆 Objectives and Key Results (OKRs)

> **Stage 1: Real Unknown** — Define measurable and time-bound goals for the project.

---

## 🎯 Objective 1: Automate Rota Management via WhatsApp Bot
*The WhatsApp bot acts as the primary coordinator for filling shifts, checking availability, and reminding volunteers.*

- **KR 1.1:** 100% of rota schedule reminders are sent autonomously by the WhatsApp bot.
- **KR 1.2:** Reduce manual administrative overhead for rota organizers by 80%.
- **KR 1.3:** Achieve a 95% shift-fill rate with zero manual intervention required for fully staffed weeks.

---

## 🎯 Objective 2: Provide Seamless Volunteer Support
*Ensure volunteers can easily update availability or request covers without logging into a complex web app.*

- **KR 2.1:** Bot correctly parses and updates volunteer availability via natural language WhatsApp messages 90% of the time.
- **KR 2.2:** Critical updates and escalations are reliably forwarded to the administrative Discord channel within 5 seconds.

---

## 🎯 Objective 3: Bot-driven development runs on a closed harness (SPEC-014)
*A bot closes a bounded task with a green verifier and a reviewable PR — no person in the session.*

- **KR 3.1:** Every bot task carries a 5-field packet (id, outcome, allowed paths, forbidden paths, verifier); packets missing a field are refused.
- **KR 3.2:** 100% of bot runs end in either a green-`smoke_test.py` PR or a `[PENDING]` stop with error/fix logs — never a push to `main`, never auto-merge.
- **KR 3.3:** 3/3 golden tasks pass (broken link fix, nav-sync page add, secret-commit refusal) before `bot-ready` issues are opened to the harness.
