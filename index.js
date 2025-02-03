const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.tce.sp.gov.br/noticias';
const webhookUrl = 'https://hook.eu2.make.com/57co57jafevp7bb5sypaqpnajra5t7x1'; // Substitua pelo seu webhook
const lastPostFile = 'lastPost.json'; // Arquivo para armazenar a última postagem

async function getLastSavedPost() {
    try {
        if (fs.existsSync(lastPostFile)) {
            const data = fs.readFileSync(lastPostFile, 'utf8');
            return JSON.parse(data).lastPost || null;
        }
    } catch (error) {
        console.error('Erro ao ler arquivo de últimas postagens:', error);
    }
    return null;
}

async function saveLastPost(postTitle) {
    try {
        fs.writeFileSync(lastPostFile, JSON.stringify({ lastPost: postTitle }), 'utf8');
    } catch (error) {
        console.error('Erro ao salvar última postagem:', error);
    }
}

async function checkForNewPosts() {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        const newPosts = [];
        let latestPostTitle = null;

        // Pegando a postagem mais recente da página
        $('div.field--label-hidden.field--item h2 a').each((index, element) => {
            const title = $(element).text().trim();
            if (index === 0) {
                latestPostTitle = title; // Salva o título mais recente
            }
            newPosts.push(title);
        });

        if (!latestPostTitle) {
            console.log('Nenhuma postagem encontrada.');
            return;
        }

        // Obtendo a última postagem salva
        const lastSavedPost = await getLastSavedPost();

        // Se a postagem mais recente for diferente da última salva, dispare o webhook
        if (lastSavedPost !== latestPostTitle) {
            await axios.post(webhookUrl, { newPosts });
            console.log('Webhook disparado com novas postagens:', newPosts);
            await saveLastPost(latestPostTitle); // Salva a nova postagem mais recente
        } else {
            console.log('Nenhuma nova postagem encontrada.');
        }
    } catch (error) {
        console.error('Erro ao verificar postagens:', error);
    }
}

checkForNewPosts();



/*
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

*/
