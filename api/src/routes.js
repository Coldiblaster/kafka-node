import express from 'express';

const routes = new express.Router();

routes.post('/certifications', async (req, res) => {
  const message = {
    user: { id: 1, name: 'Diego Fernandes' },
    course: 'Kafka com Node.js',
    grade: 10,
  }

  await req.producer.send({
    topic: 'issue-certificate',
    messages: [
      { 
        value: JSON.stringify(message),
      },
    ],
  })

  return res.json({ ok: true });
});

export default routes;