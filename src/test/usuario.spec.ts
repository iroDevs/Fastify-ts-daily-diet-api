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

    it('Deve criar um usuario', async () => {
        const response = await request(app.server)
            .post('/usuario')
            .send({
                nome: 'teste'
            })
            .expect(201)

        expect(response.body).toEqual({sucesso: 'Usuário criado com sucesso'})
    })

    it('Deve atualizar um usuario', async () => {
        await request(app.server)
            .post('/usuario')
            .send({
                nome: 'teste'
            })
            .expect(201)

        const response = await request(app.server)
            .put('/usuario/1')
            .send({
                nome: 'teste2'
            })
            .expect(200)

         const getUserEditado = await request(app.server).get('/usuario/1')

        expect(getUserEditado.body.nome).toEqual('teste2')
        expect(response.body).toEqual({sucesso: 'Usuário atualizado com sucesso'})
    })

    it('Deve retornar um usuario', async () => {
        await request(app.server)
            .post('/usuario')
            .send({
                nome: 'teste'
            })
            .expect(201)

        const response = await request(app.server)
            .get('/usuario/1')
            .expect(200)

        expect(response.body.nome).toEqual('teste')
    })

    it('Deve deletar um usuario', async () => {
        await request(app.server)
            .post('/usuario')
            .send({
                nome: 'teste'
            })
            .expect(201)

        const response = await request(app.server)
            .delete('/usuario/1')
            .expect(200)

        expect(response.body).toEqual({sucesso: 'Usuário deletado com sucesso'})
    })
})