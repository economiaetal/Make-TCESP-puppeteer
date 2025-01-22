const puppeteer = require('puppeteer');
const axios = require('axios');

async function checkPage() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://www.tce.sp.gov.br/noticias');

    // Extrair as notícias (ajuste o seletor conforme necessário)
    const newContent = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('.node-title a')).map(el => el.textContent.trim());
      return titles.slice(0, 5); // Pega os 5 primeiros títulos
    });

    console.log('Novidades:', newContent);

    // Enviar os dados para o webhook do Make.com
    await axios.post('https://hook.make.com/SEU-WEBHOOK', {
      message: 'Página atualizada!',
      data: newContent,
    });

    await browser.close();
  } catch (error) {
    console.error('Erro ao verificar a página:', error.message);
  }
}

// Rodar o script a cada 10 minutos (600.000 ms)
setInterval(() => {
  console.log('Verificando atualizações na página...');
  checkPage();
}, 10 * 60 * 1000); // 10 minutos em milissegundos
