//подключение npm библиотек
const VkBot = require('node-vk-bot-api')
const Markup = require('./node_modules/node-vk-bot-api/lib/markup.js')
const dialogflow = require('@google-cloud/dialogflow');
//подключение конфиг файлов
const conf = require('./credit.json')
const configf = require('./config.json')
//авторизация бота
const bot = new VkBot(configf.vktoken)
//настройка dialogflow
const projectId = 'chatbotproject-wvni'
let config = {
    credentials: {
        private_key: conf.private_key,
        client_email: conf.client_email
    }
}
const sessionClient = new dialogflow.SessionsClient(config);

//запуск LongPoll
bot.startPolling(() => {
    console.log('VKBot started.')
})
//обработка команд

bot.command('Случайное', async (ctx) => {
    let args = ctx.message.body.split(' ')
    let rp = await randomInteger(parseInt(args[2]),parseInt(args[3]))
    ctx.reply(rp)
})

bot.command('Счет', async (ctx) => {
    let str = ctx.message.body.substring(5)
    console.log(str)
    let rp = await calc.calculate(str)
    ctx.reply(rp)
})
bot.command('')
//обработка общения с помощью dialogflow
bot.on((ctx) => {

    let te = ctx.message.body

        async function dontknown(ctx, bot) {
            let resp = await whatdialog(ctx)
        }
        dontknown(ctx, bot)

})
//отправка запроса к dialogflow, получение ответа
async function whatdialog(ctx) {
    let data = new Date()
let sessionId = ctx.message.peer_id + data.getFullYear() + data.getDate() + data.getMonth()
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
    let txe = ctx.message.body
    console.log(txe)
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: txe,
                languageCode: 'ru-RU',
            },
        },
    };
    const responses = await sessionClient.detectIntent(request);

    const result = responses[0].queryResult;
    console.log(`${result.fulfillmentText}`);
    ctx.reply(result.fulfillmentText)

}

//функции счета и утилит
function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}
function Calculator() {

    this.methods = {
        "-": (a, b) => a - b,
        "+": (a, b) => a + b,
        "*": (a,b) => a*b,
        "/": (a,b) => a/b,

        "^": (a,b) => a^b

    };

    this.calculate = function(str) {
        let oldst  = str
        if (str.split(' ').length == 1  && (str.split('*').length == 1 || str.split('-').length == 1  ||str.split('+').length == 1 || str.split('/').length == 1 || str.split('^').length == 1 )) {

            str = str.split('')
           let deistv
            str.forEach(function (elem) {
                if(isNaN(parseInt(elem))) {
                    deistv = elem
                }
            })

            oldst = oldst.split(deistv)
            str = oldst[0] + ' '+ deistv  + ' '+ oldst[1]
        }
        let split = str.split(' '),
            a = +split[0],
            op = split[1],
            b = +split[2]

        if (!this.methods[op] || isNaN(a) || isNaN(b)) {
            return NaN;
        }

        return this.methods[op](a, b);

    }

    this.addMethod = function(name, func) {
        this.methods[name] = func;
    };
}
//создание
let calc = new Calculator;
