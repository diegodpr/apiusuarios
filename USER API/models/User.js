const knex = require('../database/connection')
const bcrypt = require('bcrypt')
const Knex = require('knex')

class User {


    async findAll() {
        try {
            const users = await knex.select('id', 'name', 'email', 'role').table('users')
            return users
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async findById(id) {
        try {
            const user = await knex.select('id', 'name', 'email', 'role').where({ id: id }).table('users')
            if (user.length > 0) {
                return user[0]
            } else {
                return undefined
            }
        } catch (error) {
            return undefined
        }

    }

    async new(name, email, password) {
        try {

            const hash = await bcrypt.hash(password, 10)

            await knex.insert({ name, email, password: hash, role: 0 }).table('users')
        } catch (error) {
            console.log(error)
        }
    }

    async findEmail(email) {
        try {
            var result = await knex('users').select("*").where({ email: email })
            if (result != 0) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(err)
        }
    }

    async update(id, name, email, role) {

        try {
            const user = await this.findById(id)

            if (user != undefined) {
                const editUser = {}

                if (email != undefined) {
                    const result = await this.findEmail(email)

                    if (result == true) {
                        return { status: "O email já existe" }
                    } else {
                        editUser.email = email
                    }

                }

                if (name != undefined) {
                    editUser.name = name
                }

                if (role != undefined) {
                    editUser.role = role
                }
                try {
                    await knex.update(editUser).where({ id: id }).table('users')
                    return { status: "Cadastro Alterado" }
                } catch (error) {
                    return { status: false, err: "Erro ao cadastrar" }
                }


            } else {
                return { status: false, err: "O usuario não existe" }
            }

        } catch (error) {
        }
    }

    async delete(id) {
        const user = await this.findById(id)
        if (user != undefined) {
            try {
                await knex.del().where({ id: id }).table('users')
                return { status: true }
            } catch (error) {
                return { status: false, err: error }
            }
        } else {
            return { status: false, err: "O usuario não existe" }
        }
    }

}

module.exports = new User()