import Fastify from 'fastify';
import usuarioRoutes from './routes/usuarios';
// import knex from './database/database';
import fastifyCookie from '@fastify/cookie'

const fastify = Fastify({
    logger: true
  });

  fastify.register(fastifyCookie);
  fastify.register(usuarioRoutes, {prefix: '/usuario'})


export default fastify;