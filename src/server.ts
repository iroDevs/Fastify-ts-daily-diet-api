// import env from './env/env';
import fastify from './app';



  const start = async () => {
    try {
        const PORT = 3000;

       await fastify.listen({ port: Number(PORT)})
        console.log(`Server listening on ${PORT}`);

    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }

  start();