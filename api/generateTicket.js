import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name = '', surname = '', email = '' } = req.body;

    // Создаем PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    // Подключаем TTF шрифт с кириллицей
    const fontPath = path.resolve('./public/fonts/Roboto-Regular.ttf');
    const fontBytes = fs.readFileSync(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    const { width, height } = page.getSize();

    // Оформление билета
    const title = '🎫 Билет на концерт Эскалада, Totma, X-Caro | Ставрополь';
    const info = `Имя: ${name} ${surname}\nEmail: ${email}\nДата: 6 декабря, 19:00\nМесто: Rock Bar, ул. Пирогова 63Б\nЦена: 500₽`;

    // Рамка
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(0.2, 0.2, 0.7),
      borderWidth: 2,
    });

    // Заголовок
    page.drawText(title, { x: 50, y: height - 80, size: 18, font, color: rgb(0.1, 0.1, 0.8) });

    // Информация
    page.drawText(info, { x: 50, y: height - 140, size: 14, font, color: rgb(0, 0, 0) });

    // Сохраняем PDF
    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="ticket.pdf"');
    res.status(200).end(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Ошибка генерации билета' });
  }
}
