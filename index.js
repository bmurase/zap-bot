import qrcode from 'qrcode-terminal'
import axios from 'axios'
import { Client, MessageMedia } from 'whatsapp-web.js'
import dotenv from 'dotenv'

dotenv.config()

const client = new Client()

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true })
});

client.on('ready', () => {
  console.log('Client is ready!');
});

const validDogMessages = [
  'POR FAVOR, ME MOSTRA UM DOGUINHO FOFO',
  'POR FAVOR ME MOSTRA UM DOGUINHO FOFO',
  'PLS GIMME DOG FOFO',
  'DOGUINHO FOFO',
]

const validCatMessages = [
  'POR FAVOR, ME MOSTRA UM GATINHO FOFO',
  'POR FAVOR ME MOSTRA UM GATINHO FOFO',
  'PLS GIMME GATO FOFO',
  'GATINHO FOFO',
]

const validBosnoasnoMessages = [
  'BOLSONARO',
  'JAIR SE ACOSTUMANDO',
  'MITO 2022'
]

client.on('message', async msg => {
  const messageIsAboutDogs = validDogMessages.find(message => message == msg.body.toUpperCase())
  const messageIsAboutCats = validCatMessages.find(message => message == msg.body.toUpperCase())
  const messageIsAboutBosnoasno = validBosnoasnoMessages.find(message => msg.body.toUpperCase().includes(message))

  if (messageIsAboutDogs) {
    const { data } = await axios.get('https://dog.ceo/api/breeds/image/random')
    const media = await MessageMedia.fromUrl(data.message)

    msg.reply(media)
    client.sendMessage(msg.from, 'um doguinho fofo pra vc ☺️')
  } else if (messageIsAboutBosnoasno) {
    const media = await MessageMedia.fromUrl('https://gay.blog.br/wp-content/uploads/2021/07/0f12b5f4-c937-42d6-9af5-eabbc558a1d6.jpg')
    msg.reply(media)
  } else if (messageIsAboutCats) {
    const { data } = await axios.get('https://api.thecatapi.com/v1/images/search?size=full&mime_types=jpg&limit=1', {
      headers: {
        'x-api-key': process.env.THECAT_API_KEY
      }
    })

    const media = await MessageMedia.fromUrl(data[0].url)
    msg.reply(media)
    client.sendMessage(msg.from, 'um gatinho fofo pra vc ☺️')
  }
});

client.initialize();