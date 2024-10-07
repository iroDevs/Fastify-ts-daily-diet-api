import { randomUUID } from "crypto";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from 'zod'
import { kenex as knex } from '../database/database';

export default async function receitaRoutes(fastify: FastifyInstance) {

    fastify.get('/metricas/user/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {

        const id = request.params.id
        const todasRefeicoes = await knex('receita').where('usuario_id', id).select('*')
        const totalRefeicoes = todasRefeicoes.length
        const totalRefeicoesDentroDieta = todasRefeicoes.filter(receita => receita.dieta).length
        const totalRefeicoesForaDieta = todasRefeicoes.filter(receita => !receita.dieta).length


        //Logica para melhor sequencia
        let sequenciaMaisAltaAtual = 0
        let sequenciaAtual = 0
        let elementosDaSequencia: Array<any> = []
        let sequenciaValida = false
        if (todasRefeicoes) {

            todasRefeicoes.forEach((receita, index, array) => {

                if (receita.dieta && array[index + 1]?.dieta) {
                    sequenciaAtual++
                    sequenciaValida = true
                }else{
                    sequenciaValida = false
                }

                if (sequenciaValida && sequenciaAtual > sequenciaMaisAltaAtual) {
                    sequenciaMaisAltaAtual = sequenciaAtual
                    elementosDaSequencia.push(receita)
                }

            })
        }

        return reply.status(200).send({
            totalRefeicoes: totalRefeicoes,
            totalRefeicoesDentroDieta: totalRefeicoesDentroDieta,
            totalRefeicoesForaDieta: totalRefeicoesForaDieta,
            melhorSequencia: {total: sequenciaMaisAltaAtual, elementos: elementosDaSequencia}
        })

    })

    fastify.get('/user/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
        const id: string = request.params.id
        const receitas = await knex('receita').where('usuario_id', id).select('*')
        return reply.status(200).send(receitas)
    })

    fastify.get('/user/cookie', async (request, reply) => {
        let cookie = request.cookies.sessionId
        console.log(cookie)

        const receitas = await knex('receita').where('cookie_usuario', cookie).select('*')
        return reply.status(200).send(receitas)
    })

    fastify.get('/', async (request, reply) => {
        const receitas = await knex('receita').select('*')
        return reply.status(200).send(receitas)
    });

    fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
        const receita = await knex('receita').where('id', request.params.id).first()
        if (!receita) {
            return reply.status(404).send({ erro: 'Receita não encontrada' })
        }
        return reply.status(200).send(receita)
    });

    fastify.post('/', async (request, reply) => {
        try {
            const receitasSchema = z.object({
                nome: z.string(),
                descricao: z.string(),
                dataHora: z.string(),
                estaNaDienta: z.boolean(),
                usuarioId: z.number()
            })

            const receita = receitasSchema.parse(request.body)
            let cookie = request.cookies.sessionId

            if (!cookie) {
                cookie = randomUUID()
                reply.setCookie('sessionId', cookie, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7 // 1 Semana
                })
            }

            await knex('receita').insert({
                nome: receita.nome,
                descricao: receita.descricao,
                data_hora: receita.dataHora,
                dieta: receita.estaNaDienta,
                cookie_usuario: cookie,
                usuario_id: receita.usuarioId
            })
            return reply.status(201).send({ sucesso: 'Receita criada com sucesso' })
        }catch (erro){
            return reply.status(400).send({ error: "Dados inválidos" })
        }

    });

    fastify.put('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
        try {
            const receitasSchema = z.object({
                nome: z.string(),
                descricao: z.string(),
                dataHora: z.string(),
                estaNaDienta: z.boolean(),
                usuarioId: z.number()
            })

            const id: string = request.params.id
            const receita = receitasSchema.parse(request.body)
            await knex('receita').where('id', id).update(receita)

        } catch (error) {
            return reply.status(400).send({ error: "Erro ao atualizar receita" })
        }

    });

    fastify.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
        try {
            const id: string = request.params.id
            await knex('receita').where('id', id).delete()
            return reply.status(200).send({ sucesso: 'Receita deletada com sucesso' })
        } catch (error) {
            return reply.status(400).send({ error: "Erro ao deletar receita" })
        }
    })

}