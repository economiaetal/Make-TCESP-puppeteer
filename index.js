const puppeteer = require('puppeteer');
const axios = require('axios');

async function checkPage() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://www.tce.sp.gov.br/noticias');
  
  // Selecionar as notícias (ajuste o seletor conforme necessário)
  const newContent = await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('.node-title a')).map(el => el.textContent.trim());
    return titles.slice(0, 5); // Pegue os 5 primeiros
  });

  console.log('Novidades:', newContent);

  // Enviar para o webhook
  await axios.post('https://hook.make.com/SEU-WEBHOOK', {
    message: 'Página atualizada!',
    data: newContent
  });

  await browser.close();
}

checkPage().catch(console.error);
