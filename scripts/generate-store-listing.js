const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, BorderStyle, WidthType, ShadingType, LevelFormat,
  AlignmentType, ExternalHyperlink
} = require('docx');
const fs = require('fs');
const path = require('path');

const orange = 'C05F1A';
const border = { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' };
const borders = { top: border, bottom: border, left: border, right: border };

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun(text)],
  });
}

function body(text) {
  return new Paragraph({
    children: [new TextRun(text)],
    spacing: { after: 120 },
  });
}

function tableRow(question, answer, shaded) {
  const fill = shaded ? 'F9F9F9' : 'FFFFFF';
  const cell = (text, bold = false) => new TableCell({
    borders,
    width: { size: 4680, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text, bold })] })],
  });
  return new TableRow({ children: [cell(question, true), cell(answer)] });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 24 } } },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 40, bold: true, font: 'Arial', color: '1A1A1A' },
        paragraph: { spacing: { before: 0, after: 200 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: orange },
        paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: [
      // Title
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun('MiTime \u2014 App Store Listing')],
      }),

      // Section 1
      h2('Short Description'),
      new Paragraph({
        children: [new TextRun({ text: '80 characters max \u2014 Play Store', italics: true, color: '999999', size: 20 })],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Your personal solar time, based on your exact location on Earth.', bold: true })],
        spacing: { after: 160 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: orange, space: 8 } },
        indent: { left: 180 },
      }),

      // Section 2
      h2('Full Description'),
      new Paragraph({
        children: [new TextRun({ text: 'Play Store / App Store', italics: true, color: '999999', size: 20 })],
        spacing: { after: 120 },
      }),
      body('MiTime gives you your own personal time \u2014 not the time your timezone says it is, but the time the sun says it is.'),
      body('Standard time zones group millions of people into the same hour, regardless of where the sun actually is in the sky. MiTime breaks that down to your exact longitude. When MiTime shows 12:00 PM, the sun is directly overhead your precise location.'),

      new Paragraph({
        children: [new TextRun({ text: 'FEATURES', bold: true })],
        spacing: { before: 160, after: 100 },
      }),
      ...[
        'Personal Solar Clock \u2014 See your real solar time, updated live based on your GPS location.',
        'Time Comparison \u2014 See your MiTime alongside standard time, and the exact difference between them.',
        'Solar Alarms \u2014 Set alarms in MiTime. Your wake time stays anchored to the sun all year, even as standard time drifts due to the Equation of Time.',
        'Equation of Time Correction \u2014 MiTime accounts for Earth\u2019s elliptical orbit, giving you accurate apparent solar time year-round.',
      ].map(text => new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        children: [new TextRun(text)],
        spacing: { after: 80 },
      })),

      new Paragraph({
        children: [new TextRun({ text: 'WHY MITIME?', bold: true })],
        spacing: { before: 160, after: 100 },
      }),
      body('Your body\u2019s circadian rhythm is governed by the sun, not by time zones. MiTime lets you live and sleep in sync with your actual solar position \u2014 the way time was measured for centuries before arbitrary zones were drawn.'),

      // Section 3
      h2('Keywords'),
      new Paragraph({
        children: [new TextRun({ text: 'App Store \u2014 100 characters max', italics: true, color: '999999', size: 20 })],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'solar time,sundial,circadian,longitude,solar noon,personal time,clock,alarm,sun,astronomy', font: 'Courier New', size: 20 })],
        spacing: { after: 160 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: orange, space: 8 } },
        indent: { left: 180 },
      }),

      // Section 4
      h2('Google Play Tags'),
      ...['Solar time', 'Clock', 'Alarm clock', 'Astronomy', 'Circadian rhythm'].map(tag =>
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun(tag)],
          spacing: { after: 60 },
        })
      ),

      // Section 5
      h2('Content Rating Questionnaire'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders,
                width: { size: 4680, type: WidthType.DXA },
                shading: { fill: '1A1A1A', type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: 'Question', bold: true, color: 'FFFFFF' })] })],
              }),
              new TableCell({
                borders,
                width: { size: 4680, type: WidthType.DXA },
                shading: { fill: '1A1A1A', type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: 'Answer', bold: true, color: 'FFFFFF' })] })],
              }),
            ],
          }),
          tableRow('Violence', 'No', false),
          tableRow('Sexual content', 'No', true),
          tableRow('Profanity', 'No', false),
          tableRow('Controlled substances', 'No', true),
          tableRow('User-generated content', 'No', false),
          tableRow('Location sharing', 'Yes \u2014 used locally on device only, not shared', true),
          tableRow('Personal info collected', 'No', false),
          tableRow('Ads', 'No', true),
        ],
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Final rating: ', bold: true }), new TextRun('Everyone / 4+')],
        spacing: { before: 160, after: 160 },
      }),

      // Section 6
      h2('Privacy Policy URL'),
      new Paragraph({
        children: [
          new ExternalHyperlink({
            link: 'https://edsallandrew-byte.github.io/MiTime-App/privacy-policy.html',
            children: [new TextRun({
              text: 'https://edsallandrew-byte.github.io/MiTime-App/privacy-policy.html',
              style: 'Hyperlink',
            })],
          }),
        ],
        spacing: { after: 160 },
      }),
    ],
  }],
});

const outPath = path.join(__dirname, '..', 'MiTime_StoreListing.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created:', outPath);
});
