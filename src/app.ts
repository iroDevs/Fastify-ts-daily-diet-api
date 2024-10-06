import Fastify from 'fastify';
//import usuarioRoutes from './usuarios/usuarios';
// import knex from './database/database';


const fastify = Fastify({
    logger: true
  });

fastify.register(usuarioRoutes, {prefix: '/usuarios'})


export default fastify;