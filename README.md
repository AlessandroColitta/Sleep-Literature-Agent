# 💤 Sleep Literature Agent

An open-source, zero-cost agent built on **Google Apps Script** and **Google Gemini 2.5 Flash** that automatically monitors recent publications publications across the most cited sleep research journals.

It runs autonomously on Google's cloud servers every week—delivering a synthesized clinical & scientific briefing to your inbox, even when your computer is off.

---

## 📚 Monitored Journals
The agent tracks newly deposited DOIs via the Crossref REST API for:
* **Sleep** (Oxford Academic)
* **Sleep Medicine Reviews** (Elsevier)
* **Sleep Health** (Elsevier)
* **Journal of Sleep Research** (Wiley)
* **Sleep Medicine** (Elsevier)
* **Journal of Pineal Research** (Wiley)
* **Journal of Clinical Sleep Medicine** (Springer Nature)

---

## Quickstart

### 1. Get a Free Gemini API Key
* Go to [Google AI Studio](https://aistudio.google.com/).
* Sign in and click **Get API key** → **Create API key**. *(100% free, no credit card required).*

### 2. Set Up Google Apps Script
1. Go to [script.google.com](https://script.google.com/) and click **+ New project**.
2. Copy and paste the code from [`Code.js`](./Code.js).
3. Replace `YOUR_API_KEY_HERE` with your Gemini key, and `YOUR_EMAIL_HERE` with your target email.
4. Click **Save** (`Ctrl + S`), select `weeklySleepBriefing`, and click **▶ Run** to authorize permissions and send a test email.

### 3. Schedule the Weekly Trigger (Runs with PC Off)
1. In the Apps Script left sidebar, click the **Alarm Clock (Triggers)** icon.
2. Click **+ Add Trigger** (bottom-right).
3. Set:
   * **Function to run:** `weeklySleepBriefing`
   * **Event source:** `Time-driven`
   * **Trigger type:** `Week timer`
   * **Day of week:** `Every Monday` (e.g., 7am to 8am)
4. Click **Save**.

---

## 👨‍⚕️ Author
Developed by **Alessandro Colitta**, M.D., ESRS Sleep Medicine Expert, using Gemini 3.8 Flash.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
