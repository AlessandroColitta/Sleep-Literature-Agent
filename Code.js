/**
 * Autonomous Weekly Sleep Literature Digest
 * Author: Alessandro Colitta (ESRS Sleep Medicine Expert)
 * 
 * Automatically checks Crossref for advance/in-press articles across 7 premier
 * sleep journals, synthesizes clinical takeaways via Gemini 2.5 Flash, 
 * and emails an executive briefing every Monday.
 */

// 1. Configuration
const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; // Get free at https://aistudio.google.com/
const RECIPIENT_EMAIL = "YOUR_EMAIL_HERE";  // Target email address

// 2. Monitored Sleep Journals (Advance / In-Press via Crossref)
const JOURNALS = [
  { name: "Sleep", issn: "1550-9109" },
  { name: "Sleep Medicine Reviews", issn: "1087-0792" },
  { name: "Sleep Health", issn: "2352-7218" },
  { name: "Journal of Sleep Research", issn: "1365-2869" },
  { name: "Sleep Medicine", issn: "1389-9457" },
  { name: "Journal of Pineal Research", issn: "1600-079X" },
  { name: "Journal of Clinical Sleep Medicine", issn: "1550-9397" }
];

function weeklySleepBriefing() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  let articles = [];

  // Fetch recent DOIs from Crossref
  JOURNALS.forEach(j => {
    const url = `https://api.crossref.org/journals/${j.issn}/works?filter=type:journal-article,from-created-date:${sevenDaysAgo}&sort=published&order=desc&rows=10`;
    try {
      const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      if (response.getResponseCode() === 200) {
        const data = JSON.parse(response.getContentText());
        const items = data.message.items || [];
        items.forEach(item => {
          articles.push({
            journal: j.name,
            title: item.title ? item.title[0] : "Untitled",
            doi: item.DOI,
            url: `https://doi.org/${item.DOI}`
          });
        });
      }
    } catch (e) {
      Logger.log("Error checking " + j.name + ": " + e);
    }
  });

  if (articles.length === 0) {
    Logger.log("No new articles this week.");
    return;
  }

  // Ask Gemini 2.5 Flash to summarize found literature
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `
  You are an expert academic research assistant preparing a weekly digest for sleep medicine researchers and physicians.
  Analyze these ${articles.length} new advance/in-press articles from the top sleep journals:
  ${JSON.stringify(articles, null, 2)}

  Format as clean HTML for an email newsletter.
  1. Group by Journal:
     - Sleep
     - Sleep Medicine Reviews
     - Sleep Health
     - Journal of Sleep Research
     - Sleep Medicine
     - Journal of Pineal Research
     - Journal of Clinical Sleep Medicine
  2. For each article:
     - Provide the title as a clickable link using its URL
     - Add a concise Research & Clinical Takeaway highlighting scientific and practical relevance.

  Do NOT wrap in markdown code blocks (\`\`\`html). Output pure HTML only.
  `;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const aiResponse = UrlFetchApp.fetch(geminiUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });

  let aiText = JSON.parse(aiResponse.getContentText()).candidates[0].content.parts[0].text;
  
  // Clean markdown fences if included
  aiText = aiText.replace(/```html/gi, "").replace(/```/g, "").trim();

  // Send email directly via Gmail
  GmailApp.sendEmail(
    RECIPIENT_EMAIL,
    `Weekly Sleep Literature Digest - ${new Date().toLocaleDateString()}`,
    "Please enable HTML email view.",
    { htmlBody: aiText }
  );
}
