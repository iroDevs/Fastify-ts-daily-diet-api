import { expect, it , beforeAll, describe , afterAll, beforeEach,} from 'vitest'
import request from 'supertest'
import  app  from '../app'
import { execSync } from 'child_process'



describe('Testando rotas de usuario', () => {
    beforeAll(async () => {
        await app.ready()
        execSync('npx knex migrate:rollback --all')
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(async () => {
        execSync('npx knex migrate:rollback --all')
        execSync('npx knex migrate:latest')
    })

    it('Deve criar uma receita', async () => {
        const response = await request(app.server)
            .post('/receita')
            .send({
                nome: "Broa",
                descricao: "boa",
                dataHora: "2024-10-06 00:00:00",
                estaNaDienta: false,
                usuarioId: 1
            })
            .expect(201)

        expect(response.body).toEqual({sucesso: 'Receita criada com sucesso'})
    })

    it('Deve atualizar uma receita', async () => {
        await request(app.server)
            .post('/receita')
            .send({
                nome: "Broa",
                descricao: "boa",
                dataHora: "2024-10-06 00:00:00",
                estaNaDienta: false,
                usuarioId: 1
            })
            .expect(201)

        const response = await request(app.server)
            .put('/receita/1')
            .send({
                nome: "Broa teste",
                descricao: "boa",
                dataHora: "2024-10-06 00:00:00",
                estaNaDienta: false,
                usuarioId: 1
            })
            .expect(200)
            console.log(response.body);


         const getReceitaEditada = await request(app.server).get('/receita/1')

        expect(getReceitaEditada.body.nome).toEqual('Broa')
        expect(response.body).toEqual({sucesso: 'Receita atualizada com sucesso'})
    })

    it('Deve retornar uma receita', async () => {
        await request(app.server)
            .post('/receita')
            .send({
                nome: "Broa",
                descricao: "boa",
                dataHora: "2024-10-06 00:00:00",
                estaNaDienta: false,
                usuarioId: 1
            })
            .expect(201)

        const response = await request(app.server)
            .get('/receita/1')
            .expect(200)
    })

    it('Deve deletar uma receita', async () => {
        await request(app.server)
            .post('/receita')
            .send({
                nome: "Broa",
                descricao: "boa",
                dataHora: "2024-10-06 00:00:00",
                estaNaDienta: false,
                usuarioId: 1
            })
            .expect(201)

        const response = await request(app.server)
            .delete('/receita/1')
            .expect(200)
    })

    it('deve rotornar a metrica de um usuario', async () => {
        //cria ussuario cria uma receita , cria outra receita e pede a metrica/usuario/:id
        await request(app.server)
            .post('/usuario')
            .send({
                nome: 'teste'
            })
            .expect(201)

        await request(app.server)
            .post('/receita')
            .send({
                nome: "Broa",
                descricao: "boa",
                dataHora: "2024-10-06 00:00:00",
                estaNaDienta: true,
                usuarioId: 1
            })
            .expect(201)

        await request(app.server)
            .post('/receita')
            .send({
                nome: "pao",
                descricao: "boa",
                dataHora: "2024-10-06 00:00:00",
                estaNaDienta: true,
                usuarioId: 1
            })
            .expect(201)

            await request(app.server)
            .post('/receita')
            .send({
                nome: "bolinho",
                descricao: "boa",
                dataHora: "2024-10-06 00:00:00",
                estaNaDienta: false,
                usuarioId: 1
            })
            .expect(201)

        const response = await request(app.server)
            .get('/receita/metricas/usuario/1')
            .expect(200)
    })
})