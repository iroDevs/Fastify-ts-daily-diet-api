import { expect, it , beforeAll, describe , afterAll, beforeEach,} from 'vitest'
import request from 'supertest'
import  app  from '../app'
import { execSync } from 'child_process'



describe('Testando rotas de Receita', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        try {
            execSync('npx knex migrate:rollback --all');
            execSync('npx knex migrate:latest');
        } catch (error) {
            console.error('Error during migration rollback:', error);
            throw error; // Para garantir que o erro seja exibido
        }
    })

    it('Deve criar uma receita', async () => {
        const response = await request(app.server)
            .post('/receita')
            .send({
                nome: "carne",
                descricao: "boa",
                data_hora: "2024-10-06 00:00:00",
                dieta: true,
                usuario_id: 1
            })
            .expect(201)

        expect(response.body).toEqual({sucesso: 'Receita criada com sucesso'})
    })

    it('Deve atualizar uma receita', async () => {
        await request(app.server)
            .post('/receita')
            .send({
                nome: "carne",
                descricao: "boa",
                data_hora: "2024-10-06 00:00:00",
                dieta: true,
                usuario_id: 1
            })
        const response = await request(app.server)
            .put('/receita/1')
            .send({
                nome: "carne teste",
                descricao: "boa",
                data_hora: "2024-10-06 00:00:00",
                dieta: true,
                usuario_id: 1
            })
            .expect(200)
            console.log(response.body);


         const getReceitaEditada = await request(app.server).get('/receita/1')

        expect(getReceitaEditada.body.nome).toEqual('carne teste')
        expect(response.body).toEqual({sucesso: 'Receita atualizada com sucesso'})
    })

    it('Deve retornar uma receita', async () => {
        await request(app.server)
            .post('/receita')
            .send({
                nome: "carne",
                descricao: "boa",
                data_hora: "2024-10-06 00:00:00",
                dieta: true,
                usuario_id: 1
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
                nome: "carne",
                descricao: "boa",
                data_hora: "2024-10-06 00:00:00",
                dieta: true,
                usuario_id: 1
            })


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


        await request(app.server)
            .post('/receita')
            .send({
                nome: "carne",
                descricao: "boa",
                data_hora: "2024-10-06 00:00:00",
                dieta: true,
                usuario_id: 1
            })


        await request(app.server)
            .post('/receita')
            .send({
                nome: "carne",
                descricao: "boa",
                data_hora: "2024-10-06 00:00:00",
                dieta: false,
                usuario_id: 1
            })


            await request(app.server)
            .post('/receita')
            .send({
                nome: "carne",
                descricao: "boa",
                data_hora: "2024-10-06 00:00:00",
                dieta: false,
                usuario_id: 1
            })


        const response = await request(app.server)
            .get('/receita/metricas/user/1')
            .expect(200)
    })
})