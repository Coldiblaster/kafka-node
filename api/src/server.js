import express from 'express'
import { Kafka } from 'kafkajs'

import routes from './routes'

const app = express();

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'certificate-group-receiver' })

/**
 * Disponibiliza o producer para todas rotas
 */

app.use((req, res, next) => {
  req.producer = producer;

  return next();
})

app.use(routes);

async function run() {
  await producer.connect()
  await consumer.connect()

  await consumer.subscribe({ topic: 'certification-response' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Resposta:', String(message.value));
    },
  });

  app.listen(3333);
}

run().catch(console.error)

