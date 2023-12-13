import { load } from 'cheerio';
import fs from 'fs';

export async function webScrapeDrugContent(
  drugOrFilePath: string,
  loadFromFile = false
) {
  let html;
  if (loadFromFile) {
    html = fs.readFileSync(drugOrFilePath, 'utf-8');
  } else {
    const response = await fetch(
      `https://www.drugs.com/${drugOrFilePath.toLowerCase()}.html`
    );
    if (!response.ok) return null;
    html = await response.text();
  }

  const $ = load(html);

  // Extract drug title
  let drugTitle = $('h2#uses').text().trim();

  const regex = /What is\s+(.*)?\?/;
  const match = regex.exec(drugTitle);

  drugTitle = match?.[1] ?? drugOrFilePath;

  // Extract content before #warnings
  const aboutDrug = $('[id="uses"] ~ p:not(#warnings ~ p)').text().trim();

  const warnings = $('[id="warnings"] ~ p:not(#before-taking ~ p)')
    .text()
    .trim();

  const beforeTaking = $('[id="before-taking"] ~ p:not(#directions ~ p)')
    .text()
    .trim();

  const dosage = $('[id="dosage"] ~ p:not(#missed-dose ~ p)').text().trim();

  const missDosage = $('[id="missed-dose"] ~ p:not(#overdose ~ p)')
    .text()
    .trim();

  const overDosage = $('[id="missed-dose"] ~ p:not(#what-to-avoid ~ p)')
    .text()
    .trim();

  const sideEffect = $('[id="side-effects"] ~ p:not(#interactions ~ p)')
    .text()
    .trim();

  return {
    drugTitle,
    aboutDrug,
    warnings,
    beforeTaking,
    dosage,
    missDosage,
    overDosage,
    sideEffect,
  };
}
