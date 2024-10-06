import { randomUUID } from "crypto";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from 'zod'
import { kenex as knex } from '../database/database';


export default async function usuarioRoutes(fastify: FastifyInstance) {

    fastify.get('/', async (request, reply) => {
        const usuarios = await knex('usuario').select('*')
        return reply.status(200).send(usuarios)
    });

    fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }> , reply) => {
        const id: string = request.params.id
        const usuario = await knex('usuario').where('id', id).first()

        if (!usuario) {
            return reply.status(404).send({erro: 'Usuário não encontrado'})
        }

        return reply.status(200).send(usuario)
    });

    fastify.post('/', async (request, reply) => {
        try {
            const usuarioSchema = z.object({
                nome: z.string(),
            })


            const usuario = usuarioSchema.parse(request.body)
            let cookie = request.cookies.sessionId

            if (!cookie) {
                cookie = randomUUID()
                reply.setCookie('sessionId', cookie, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7 // 1 Semana
                })
            }
            // criar usuario
            await knex('usuario').insert({
                nome: usuario.nome,
                cookie
            })

            return reply.status(201).send({sucesso: 'Usuário criado com sucesso'})

        }catch(err){
            console.log(err)
            return reply.status(400).send({erro: 'Erro ao criar usuário'})
        }
    });

    fastify.put('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
        try{
            const usuarioSchema = z.object({
                nome: z.string(),
            })

            const id: string = request.params.id
            const usuario = usuarioSchema.parse(request.body)
            await knex('usuario').where('id', id).update(usuario)
            return reply.status(200).send({sucesso: 'Usuário atualizado com sucesso'})
        }catch(err){
            console.log(err)
            return reply.status(400).send({erro: 'Erro ao atualizar usuário'})
        }
    });

    fastify.delete('/:id', async (request: FastifyRequest<{Params: {id: string}}>, reply) => {
        try{
            const id: string = request.params.id
            await knex('usuario').where('id', id).delete()
            return reply.status(200).send({sucesso: 'Usuário deletado com sucesso'})
        }catch(err){
            console.log(err)
            return reply.status(400).send({erro: 'Erro ao deletar usuário'})
        }
    })

}