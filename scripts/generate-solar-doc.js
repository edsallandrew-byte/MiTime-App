const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, ShadingType
} = require('docx');
const fs = require('fs');
const path = require('path');

const mono = (text) => new TextRun({ text, font: 'Courier New', size: 20 });
const bold = (text) => new TextRun({ text, bold: true });

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 24 } } },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Arial', color: '1a1a1a' },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: 'C05F1A' },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 },
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
        children: [new TextRun('How MiTime Calculates Solar Time')],
      }),

      // Overview
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun('Overview')],
      }),
      new Paragraph({
        children: [
          new TextRun('MiTime uses '),
          bold('Local Apparent Solar Time'),
          new TextRun(' \u2014 the same system sundials have used for centuries. Noon in MiTime is defined as the moment the sun crosses your exact meridian (directly overhead at your longitude).'),
        ],
        spacing: { after: 160 },
      }),

      // Step 1
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun('Step 1 \u2014 Longitude to Time Offset')],
      }),
      new Paragraph({
        children: [
          new TextRun('Earth rotates 360\u00b0 in 24 hours, meaning '),
          bold('1\u00b0 of longitude = 4 minutes of time'),
          new TextRun('. The base formula for solar time is:'),
        ],
        spacing: { after: 120 },
      }),
      new Paragraph({
        children: [mono('MiTime = UTC + (longitude \u00f7 15) hours')],
        indent: { left: 720 },
        spacing: { before: 80, after: 80 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'C05F1A', space: 8 } },
      }),
      new Paragraph({
        children: [
          new TextRun('Example: At \u221290\u00b0 longitude (Chicago), the offset is \u22126 hours from UTC \u2014 exactly matching the sun\u2019s position at that meridian.'),
        ],
        spacing: { before: 120, after: 160 },
      }),

      // Step 2
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun('Step 2 \u2014 Equation of Time Correction')],
      }),
      new Paragraph({
        children: [
          new TextRun("Earth\u2019s orbit is elliptical, not circular, and its axis is tilted. This means the sun does not move across the sky at a perfectly constant rate \u2014 actual solar noon drifts up to "),
          bold('\u00b116 minutes'),
          new TextRun(' from the simple longitude formula depending on the time of year. This correction is called the '),
          bold('Equation of Time (EOT)'),
          new TextRun('.'),
        ],
        spacing: { after: 120 },
      }),
      new Paragraph({
        children: [new TextRun('The approximation used in MiTime:')],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [mono('B = (360 \u00f7 365) \u00d7 (dayOfYear \u2212 81) \u00d7 (\u03c0 \u00f7 180)')],
        indent: { left: 720 },
        spacing: { before: 80, after: 40 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'C05F1A', space: 8 } },
      }),
      new Paragraph({
        children: [mono('EOT = 9.87\u00b7sin(2B) \u2212 7.53\u00b7cos(B) \u2212 1.5\u00b7sin(B)   [minutes]')],
        indent: { left: 720 },
        spacing: { before: 40, after: 80 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'C05F1A', space: 8 } },
      }),
      new Paragraph({
        children: [
          new TextRun('The value '),
          bold('81'),
          new TextRun(' is the approximate day number of the spring equinox (March 22), which anchors the correction to the solar calendar.'),
        ],
        spacing: { before: 120, after: 160 },
      }),

      // Final Formula
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun('Final Formula')],
      }),
      new Paragraph({
        children: [mono('MiTime = UTC + (longitude \u00f7 15h) + EOT')],
        indent: { left: 720 },
        spacing: { before: 80, after: 80 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'C05F1A', space: 8 } },
      }),
      new Paragraph({
        children: [
          new TextRun('When MiTime reads 12:00:00 PM, the sun is directly overhead your exact longitude. This is the personal solar noon that MiTime is built around.'),
        ],
        spacing: { before: 120, after: 240 },
      }),

      // Note
      new Paragraph({
        children: [
          new TextRun({ text: 'Note: ', bold: true, italics: true }),
          new TextRun({ text: 'This is standard Local Apparent Solar Time \u2014 the same system sundials have used for centuries. Standard time zones approximate this by grouping large geographic regions into fixed 1-hour (or 30-minute) increments. MiTime removes that approximation entirely.', italics: true, color: '666666' }),
        ],
        spacing: { before: 80 },
      }),
    ],
  }],
});

const outPath = path.join(__dirname, '..', 'MiTime_Solar_Time_Explanation.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created:', outPath);
});
