import Fastify from 'fastify';
import usuarioRoutes from './routes/usuarios';
// import knex from './database/database';
import fastifyCookie from '@fastify/cookie'
import receitaRoutes from './routes/receitas';

const fastify = Fastify({
    logger: true
  });

  fastify.register(fastifyCookie);
  fastify.register(usuarioRoutes, {prefix: '/usuario'})
  fastify.register(receitaRoutes, {prefix: '/receita'})


export default fastify;