import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, surname, email } = req.body;

    // создаем PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    const title = 'Билет на концерт Эскалада, Totma, X-Caro | Ставрополь';
    const info = `Имя: ${name} ${surname}\nEmail: ${email}\nДата: 6 декабря, 19:00\nМесто: Rock Bar, ул. Пирогова 63Б\nЦена: 500₽`;

    page.drawText(title, { x: 50, y: height - 80, size: 16, font, color: rgb(0, 0, 0) });
    page.drawText(info, { x: 50, y: height - 140, size: 12, font, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="ticket.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Ошибка генерации билета' });
  }
}
