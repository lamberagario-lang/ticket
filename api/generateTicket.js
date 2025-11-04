import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { firstName = '', lastName = '', email = '' } = req.body || {};

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([450, 320]);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSizeTitle = 14;
    const fontSizeNormal = 12;

    page.drawText('Эскалада, Totma, X-Caro | Ставрополь', { x: 40, y: 270, size: fontSizeTitle, font: helveticaFont, color: rgb(0,0,0) });
    page.drawText('Дата: 6 декабря 2025, Время: 19:00', { x: 40, y: 250, size: fontSizeNormal, font: helveticaFont });
    page.drawText('Площадка: Rock Bar, Ул. Пирогова 63Б, Ставрополь', { x: 40, y: 230, size: fontSizeNormal, font: helveticaFont });
    page.drawText(`Имя: ${firstName}`, { x: 40, y: 200, size: fontSizeNormal, font: helveticaFont });
    page.drawText(`Фамилия: ${lastName}`, { x: 40, y: 180, size: fontSizeNormal, font: helveticaFont });
    page.drawText(`Email: ${email}`, { x: 40, y: 160, size: fontSizeNormal, font: helveticaFont });
    page.drawText('Цена билета: 500 ₽', { x: 40, y: 140, size: fontSizeNormal, font: helveticaFont });
    page.drawText('Билет действителен только при предъявлении.', { x: 40, y: 120, size: 10, font: helveticaFont });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Билет_Эскалада.pdf');
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
