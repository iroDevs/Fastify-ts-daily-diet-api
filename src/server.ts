// import env from './env/env';
import fastify from './app';
import env from './env/env';


  const start = async () => {
    try {


       await fastify.listen({ port: env.NODE_PORT})
        console.log(`Server listening on ${env.NODE_PORT}`);

    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }

  start();