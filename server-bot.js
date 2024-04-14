const OpenAI = require('openai');

const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const bot = new Telegraf(process.env.BOT_TOKEN)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Функція для надсилання тексту до ChatGPT і отримання результату
async function getChatGPTResponse(prompt) {
    try {
        const response = await openai.complete({
            engine: 'gpt-3.5-turbo',
            prompt: prompt,
            // Змінено змінну maxTokens для ChatGPT
            maxTokens: 150 // Змініть за потребою

        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Помилка отримання відповіді від ChatGPT API:', error);
        return 'Вибачте, сталася помилка. Будь ласка, спробуйте пізніше.';
    }
}

// Додано новий параметр для ChatGPT
const response = await openai.complete({
    engine: 'gpt-3.5-turbo',
    prompt: prompt,
    maxTokens: 100,
    temperature: 0.5  // Доданий новий параметр
});


// Додано можливість логування помилок в консоль
console.error('Error occurred:', error);

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

// Додавання кнопки для отримання інформації про повітряні тривоги
bot.command('air_alarm', (ctx) => {
    ctx.reply('Для перегляду інформації про повітряні тривоги в Україні, натисніть на кнопку нижче.', Markup.inlineKeyboard([
        Markup.button.callback('Показати повітряні тривоги', 'show_air_alarms')
    ]));
});

const axios = require('axios');

bot.action('show_air_alarms', async (ctx) => {
    try {
        // Отримання даних про повітряні тривоги з API
        const response = await axios.get('URL_для_отримання_даних_про_повітряні_тривоги');

        // Парсинг отриманих даних
        const airAlarmsData = response.data;

        // Підготовка повідомлення для відображення
        let message = 'Інформація про повітряні тривоги:\n';
        airAlarmsData.forEach((alarm) => {
            message += `Тривога: ${alarm.type}, Тривалість: ${alarm.duration}, Час: ${alarm.time}\n`;
        });

        // Відправлення повідомлення з інформацією про повітряні тривоги
        ctx.reply(message);
    } catch (error) {
        console.error('Помилка отримання даних про повітряні тривоги в Україні:', error);
        ctx.reply('Виникла помилка при отриманні даних про повітряні тривоги. Будь ласка, спробуйте ще раз пізніше.');
    }
});

// Обробник вхідних повідомлень бота
bot.hears('gpt', async (ctx) => {
    const userMessage = ctx.message.text;

    // Отримуємо відповідь від ChatGPT за допомогою введеного повідомлення користувача
    const chatGPTResponse = await getChatGPTResponse(userMessage);

// Виправлено неправильне використання методу reply
    ctx.reply('Message');  // Поправлено на правильний метод
});

bot.launch({
    webhook: {
        domain: process.env.WEBHOOK_DOMAIN,
        port: process.env.PORT,
    },
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
