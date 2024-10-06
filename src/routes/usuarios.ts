import { FastifyInstance } from "fastify";



export default async function usuarioRoutes(fastify: FastifyInstance) {

    fastify.get('/', async (request, reply) => {
        return reply.send({ hello: 'world' })
    });

    fastify.get('/:id', async (request, reply) => {
        return reply.status(200).send({ hello: 'usuarios' })
    });

    fastify.post('/', async (request, reply) => {
        return reply.status(200).send({ hello: 'usuarios' })
    });

    fastify.put('/:id', async (request, reply) => {
        return reply.status(200).send({ hello: 'usuarios' })
    });

    fastify.delete('/:id', async (request, reply) => {
        return reply.status(200).send({ hello: 'usuarios' })
    })

}