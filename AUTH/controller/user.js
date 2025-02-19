var User = require("../model/user")


module.exports.list = () => {
    return User
        .find()
        .sort('name')
        .then(resp => {
            return resp
        })
        .catch(erro => {
            return erro
        })
}

module.exports.findByEmail = email => {
    return User
        .findOne({email : email})
        .then(resp => {
            return resp
        })
        .catch(erro => {
            return erro
        })
}

module.exports.findById = id => {
    return User
        .findById(id)
        .then(resp => {
            return resp
        })
        .catch(error => {
            return erro
        })
}

module.exports.insert = user => {
    const newUser = new User(user)
    return newUser.save()
}

module.exports.updateUser = (id, user) => {
    return User
        .findByIdAndUpdate(id, user, {new : true})
        .then(resp => {
            return resp
        })
        .catch(erro => {
            return erro
        })
}

module.exports.updatePassword = async (id, pwd) => {
    try {
      const user = await User.findOne({ _id: id });
  
      if (!user) {
        console.log('No user found with id: ' + id);
        return { error: 'Não foi encontrado um utilizador com o id fornecido' };
      }
  
      // Utilizando uma versão que retorna uma promessa para changePassword
      return new Promise((resolve, reject) => {
        user.changePassword(pwd.oldPassword, pwd.newPassword, function (err, user) {
          if (err) {
            console.log(err.name);
            if (err.name === "IncorrectPasswordError") {
              resolve({ error: 'Password Incorreta.' });
            } else {
              resolve({ error: 'Algo correu mal. Tente novamente mais tarde', message: err });
            }
          } else {
            console.log('Password changed successfully');
            user.save().then(() => resolve(user)).catch(saveErr => reject(saveErr));
          }
        });
      });
    } catch (err) {
      console.log('Error: ' + err);
      return { error: 'Algo correu mal. Tente novamente mais tarde', message: err };
    }
  };
  


module.exports.delete = id => {
    return User.deleteOne({_id:id})
        .then(resp => {
            return resp
        })
        .catch(erro => {
            return erro
        })
}