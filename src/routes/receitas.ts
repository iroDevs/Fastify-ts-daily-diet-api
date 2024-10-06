import { randomUUID } from "crypto";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from 'zod'
import { kenex as knex } from '../database/database';

export default async function receitaRoutes(fastify: FastifyInstance) {

    fastify.get('/', async (request, reply) => {
        return reply.send({ hello: 'receitas' })
    });

    fastify.get('/:id', async (request, reply) => {
        return reply.status(200).send({ hello: 'Receitas' })
    });

    fastify.post('/', async (request, reply) => {
        return reply.status(200).send({ hello: 'Receitas' })
    });

    fastify.put('/:id', async (request, reply) => {
        return reply.status(200).send({ hello: 'Receitas' })
    });

    fastify.delete('/:id', async (request, reply) => {
        return reply.status(200).send({ hello: 'Receitas' })
    })

}