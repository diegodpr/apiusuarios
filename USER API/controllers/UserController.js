const User = require('../models/User')

class UserController {

    async index(req, res) {
        const users = await User.findAll()
        res.json(users)
    }
    async findOne(req, res) {
        const { id, name, email, password, role } = req.params
        try {
            const user = await User.findById(id)

            if (user != undefined) {
                res.json(user)
            }
            else {
                res.status(400)
                res.json({ err: "Usuario não encontrado" })
            }
        } catch (error) {
            res.status(400)
            res.json({ err: "Usuario não encontrado" })
        }




    }

    async create(req, res) {
        const { name, email, password } = req.body

        if (email == undefined) {
            res.status(400)
            res.json({ err: "O e-mail é invalido" })
            return;
        }

        var emailExists = await User.findEmail(email)

        if (emailExists) {
            res.status(406)
            res.json({ err: "O email já está cadastrado" })
            return;
        }

        await User.new(name, email, password)

        res.status(200)
        res.send("Tudo Certo")

    }

    async update(req, res) {
        const { id, name, email, role } = req.body

        try {
            const user = await User.update(id, name, email, role)
            if (user.status == false) {
                res.status(400)
                res.send(user.err)
            } else {
                res.status(200)
                res.json(user)
            }

        } catch (error) {

        }

    }

    async delete(req, res) {
        const id = req.params.id

        const result = await User.delete(id)

        if (result.status) {
            res.status(200)
            res.send("Tudo OK")
        } else {
            res.status(406)
            res.send(result.err)
        }
    }
}


module.exports = new UserController()