const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      req.flash("message", "As senhas não conferem");
      res.render("auth/register");
      return;
    }

    // verificar se o email já existe
    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      req.flash("message", "Este email já está cadastrado");
      res.render("auth/register");
      return;
    }

    // criptografar a senha
    const hashPassword = bcrypt.hashSync(password, 10);
    const user = { name, email, password: hashPassword };
    try {
      const createUser = await User.create(user);

      // initial session
      req.session.userid = createUser.id;
      req.flash("message", "Cadastro realizado com sucesso");
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      req.flash("message", "Erro ao cadastrar usuário");
      res.render("auth/register");
      console.log(err);
      return;
    }
  }
};
