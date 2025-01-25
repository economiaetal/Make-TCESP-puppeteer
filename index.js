const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.tce.sp.gov.br/noticias';
const webhookUrl = 'https://hook.eu2.make.com/57co57jafevp7bb5sypaqpnajra5t7x1'; // Substitua pelo seu webhook

async function checkForNewPosts() {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        // Lógica para verificar novas postagens
        const newPosts = []; // Armazene novas postagens aqui

        // Exemplo: supondo que as postagens estão em um elemento <h2>
        $('div.field--label-hidden.field--item h2 a').each((index, element) => {
            const title = $(element).text();
            // Adicione lógica para verificar se a postagem é nova
            newPosts.push(title);
        });

        if (newPosts.length > 0) {
            // Dispara o webhook se houver novas postagens
            await axios.post(webhookUrl, { newPosts });
            console.log('Webhook disparado com novas postagens:', newPosts);
        } else {
            console.log('Nenhuma nova postagem encontrada.');
        }
    } catch (error) {
        console.error('Erro ao verificar postagens:', error);
    }
}

checkForNewPosts();

/*
const axios = require("axios");
const cheerio = require("cheerio");

// URL do webhook Make.com
const webhookUrl = "https://hook.eu2.make.com/57co57jafevp7bb5sypaqpnajra5t7x1";

// Armazena o último título do post para comparar
let lastTitle = "";

const checkForUpdates = async () => {
  try {
    // Faz o GET na página
    const { data } = await axios.get("https://www.tce.sp.gov.br/noticias");
    const $ = cheerio.load(data);

    // Seleciona o título do primeiro post (ajuste o seletor conforme a estrutura da página)
    const firstPostTitle = $("div.field--label-hidden.field--item h2 a").first().text().trim();

    // Verifica se há um novo post
    if (firstPostTitle && firstPostTitle !== lastTitle) {
      console.log(`Novo post detectado: "${firstPostTitle}"`);
      lastTitle = firstPostTitle;

      // Envia para o webhook do Make.com
      try {
        const response = await axios.post(webhookUrl, {
          title: firstPostTitle
        });
        console.log('Webhook enviado com sucesso:', response.status);
      } catch (error) {
        console.error('Erro ao enviar webhook:', error.message);
      }
      
    } else {
      console.log("Nenhum novo post encontrado.");
    }
  } catch (error) {
    console.error("Erro ao acessar a página:", error.message);
  }
};


// Verifica atualizações a cada 1 hora
setInterval(checkForUpdates, 10 * 60 * 1000);

// Primeira execução ao iniciar o script
checkForUpdates();
*/
