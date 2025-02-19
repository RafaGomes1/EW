const mongoose = require('mongoose');
const UserModel = require('../model/user'); // Ajuste o caminho conforme necessário
const { v4: uuidv4 } = require('uuid');

async function createAdmin() {
    try {
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Não conectado ao MongoDB');
        }

        const collection = mongoose.connection.collection('users'); // Verifique o nome da coleção
        const count = await collection.countDocuments({ role: 2 });

        console.log(count)

        if (count === 0) {
            console.log('A criar conta de administrador... Email: admin@learnminder.edu; Password: admin.');
            const d = new Date().toISOString().substring(0, 10);

            const adminUser = new UserModel({
                _id: uuidv4(),
                email: 'admin@learnminder.edu',
                name: 'Administrador',
                role: 2,
                active: true,
                dateCreated: d
            });

            UserModel.register(adminUser, 'admin', function (err, user) {
                if (err) {
                    console.log('Erro na criação da conta de administrador:', err.message);
                } else {
                    console.log('Conta de Administrador criada com sucesso!');
                }
            });
        } else {
            console.log('Conta de administrador existente!');
        }
    } catch (error) {
        console.error('Erro durante a criação do administrador:', error.message);
    }
}

module.exports = {createAdmin};
