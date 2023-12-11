import { load } from 'cheerio';

async function getMedicalInfo(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const html = await response.text();
    console.log(html);
    const $ = load(html);

    const medicalInfo = {
      name: $('.name-and-uses h1').text().trim(),
      uses: [] as Array<string>,
      warnings: [] as Array<string>,
      commonAdverseEffects: [] as Array<string>,
      dosage: {} as Record<string, string>,
      interactions: [] as Array<{ drug: string; description: string }>,
      moreInfo: {} as Record<string, string>,
    };

    /* 
    // Extract warnings
    $('#warnings-and-precautions').find('li').each((i, el) => {
      medicalInfo.warnings.push($(el).text().trim());
    });

    // Extract 'Before taking this medicine' information
    $('#before-taking-this-medicine').find('ul li').each((i, el) => {
      medicalInfo.beforeTaking.push($(el).text().trim());
    });

    // Extract 'How should I take Aldactone?' information
    $('#how-should-i-take-aldactone').find('li').each((i, el) => {
      medicalInfo.howToTake.push($(el).text().trim());
    });

    // Extract dosage information
    const subheadings = $('#dosage-and-administration').find('h3');
    for (let i = 0; i < subheadings.length; i++) {
      const subheading = $(subheadings[i]);
      const subheadingText = subheading.text().trim();
      medicalInfo.dosing[subheadingText] = subheading.nextUntil(subheadings[i + 1], 'p').text().trim();
    }

    // Extract 'What happens if I miss a dose?' information
    const missedDoseContent = $('#what-happens-if-i-miss-a-dose').find('p');
    medicalInfo.missedDose = missedDoseContent.text().trim().split('.');

    // Extract 'What happens if I overdose?' information
    const overdoseContent = $('#what-happens-if-i-overdose').find('p');
    medicalInfo.overdose = overdoseContent.text().trim().split('.');

    // Extract 'What to avoid' information
    $('#what-to-avoid').find('ul li').each((i, el) => {
      medicalInfo.whatToAvoid.push($(el).text().trim());
    });

    // Extract side effects
    const sideEffectSections = $('#side-effects').find('.section');
    for (let i = 0; i < sideEffectSections.length; i++) {
      const section = $(sideEffectSections[i]);
      medicalInfo.sideEffects[section.find('h3').text().trim()] = section.find('ul li').text().trim().split('\n').map(text => text.trim());
    }

    return medicalInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
    */

    // Extract uses
    $('.uses li').each((i, el) => {
      medicalInfo.uses.push($(el).text().trim());
    });

    // Extract warnings and precautions
    $('.warnings-and-precautions li').each((i, el) => {
      medicalInfo.warnings.push($(el).text().trim());
    });

    // Extract common adverse effects
    $('.common-adverse-effects li').each((i, el) => {
      medicalInfo.commonAdverseEffects.push($(el).text().trim());
    });

    // Extract dosage information
    $('#dosage-and-administration')
      .find('p, ul, li')
      .each((i, el) => {
        medicalInfo.dosage[$('.title', el).text().trim()] = $(el)
          .text()
          .trim()
          .replace($('.title', el).text().trim(), '');
      });

    // Extract interactions
    $('#interactions-and-contraindications')
      .find('.drug-interaction')
      .each((i, el) => {
        medicalInfo.interactions.push({
          drug: $('.interaction-drug', el).text().trim(),
          description: $('.interaction-description', el).text().trim(),
        });
      });

    // Extract more information sections
    const moreInfoSections = $('#monograph').find('.section');
    for (let i = 0; i < moreInfoSections.length; i++) {
      const section = $(moreInfoSections[i]);
      medicalInfo.moreInfo[section.find('h2').text().trim()] = section
        .find('p')
        .text()
        .trim();
    }

    return medicalInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
}

(async () => {
  const medicalInfo = await getMedicalInfo(
    'https://www.drugs.com/aldactone.html'
  );
  if (medicalInfo) {
    console.log(medicalInfo);
  } else {
    console.error('Failed to extract medical information.');
  }
})();
