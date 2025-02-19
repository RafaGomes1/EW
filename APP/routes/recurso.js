var express = require("express");
var router = express.Router();
const multer = require("multer");
var path = require("path");
var fs = require("fs");
var axios = require("axios");
var jsonfile = require("jsonfile");
const { v4: uuidv4 } = require("uuid");
const AdmZip = require("adm-zip");
var API = require("../config/apiEnv");
var Auth = require("../controllers/auth");

var upload = multer({ dest: "uploads" });

router.get("/consultar/:id", Auth.verifyAcess, function (req, res, next) {
  axios
    .get(
      API.apiRoute("/recurso/" + req.params.id + "?token=" + req.cookies.token)
    )
    .then((resp) => {
      var recurso = resp.data;
      res.status(200).render("consultarRecurso", { title : 'Recurso ' + recurso.titulo, Recurso: recurso, userRole : req.userRole });
    })
    .catch((erro) => {
      res.status(501).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
    });
});

router.get("/adicionar/:id", Auth.verifyAcessProducer, function (req, res, next) {
    axios.get(API.apiRoute("/tipoRecurso?token=" + req.cookies.token))
      .then((resp) => {
        var tipo = resp.data;
        var idCurso = req.params.id;
        res.status(200).render("adicionarRecurso", { Tipos: tipo, Curso: idCurso });
      })
      .catch((error) => {
        res.status(502).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
      });
  }
);

router.get("/fileContents/:fname", Auth.verifyAcess, (req, res) => {
  const filePath = path.join(__dirname, "/../public/fileStore/", req.params.fname);
  console.log("File Path:", filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading file");
      return;
    }
    res.send(data);
  });
});

router.get("/download/:fname", Auth.verifyAcess, (req, res) => {
  res.download(__dirname + "/../public/fileStore/" + req.params.fname);
});

router.post("/adicionar/:id", Auth.verifyAcessProducer, upload.single("filePath"), function (req, res, next) {
    console.log("Início da Rota POST /adicionar");

    if (!req.file) {
      console.error("Nenhum arquivo foi enviado");
      return res.status(400).render("error", { error: "Nenhum arquivo foi enviado" });
    }

    let oldPath = path.join(__dirname, '/../', req.file.path);
    let newPath = path.join(__dirname, '/../public/fileStore/', req.file.originalname);

    // Criar a pasta fileStore caso não exista
    fs.mkdir(path.join(__dirname, '/../public/fileStore/'), { recursive: true }, (err) => {
        if (err) {
            console.error("Erro ao criar a pasta fileStore: ", err);
            return res.status(500).render("error", {"error" : err});
        }

        fs.rename(oldPath, newPath, error => {
            if(error) {
                console.error("Erro ao renomear o arquivo: ", error);
                return res.status(500).render("error", {"error" : error});
            }

            console.log(req.body)

            const uniqueId = uuidv4();
            req.body._id = uniqueId;
            req.body.cursoId = req.params.id;
            req.body.dataRegisto = Date.now();
            req.body.idProdutor = req.userID; // ID do produtor fixo para simplificação, altere conforme necessário
            req.body.classificacao = [];
            req.body.filePath = req.file.originalname;

            // Capturar campos personalizados diretamente
            let predefinedFields = ['_id', 'tipo', 'tema', 'cursoId', 'titulo', 'subtitulo', 'dataRegisto', 'dataCriacao','idProdutor', 'autor', 'visibilidade', 'classificacao', 'filePath'];
            let customFields = {};
            Object.keys(req.body).forEach(key => {
                if (!predefinedFields.includes(key)) {
                    customFields[key] = req.body[key];
                }
            });
            req.body.customFields = customFields;
          
            console.log("Campos personalizados:", customFields);

            axios.post(API.apiRoute("/recurso?token=" + req.cookies.token), req.body)
              .then((resp) => {
                axios.put(API.apiRoute("/curso/" + req.body.cursoId + "/recurso?token=" + req.cookies.token), { recursoId: req.body._id })
                  .then((respo) => {
                    console.log("Recurso adicionado com sucesso!");
                    res.status(201).redirect("/curso/" + req.body.cursoId);
                  })
                  .catch((erro) => {
                    console.error("Erro ao adicionar recurso ao curso:", erro);
                    res.status(504).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
                  });
              })
              .catch((error) => {
                console.error("Erro ao adicionar recurso:", error);
                res.status(505).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
              });
        });   
    });  
});

router.get("/edit/:id", Auth.verifyAcess, function (req, res, next) {
  axios.get(API.apiRoute("/tipoRecurso?token=" + req.cookies.token))
    .then((resp) => {
      tipos = resp.data;
      axios.get(API.apiRoute("/curso?token=" + req.cookies.token))
        .then((resp1) => {
          cursos = resp1.data;
          axios.get(API.apiRoute("/recurso/" + req.params.id + "?token=" + req.cookies.token))
            .then((resp2) => {
              recurso = resp2.data;
              recurso.dataCriacao = new Date(recurso.dataCriacao).toISOString().split("T")[0];
              res.status(200).render("editarRecurso", {title : 'Editar recurso ' + recurso.titulo, Recurso: recurso, Cursos: cursos, Tipos: tipos, userRole : req.userRole});
            });
        });
    })
    .catch((erro) => {
      res.status(502).render("error", {title : 'Erro', error: erro, userRole : req.userRole });

    });
});

router.post("/edit/:id", Auth.verifyAcess, upload.single("filePath"), function (req, res, next) {
    if (req.file) {
      axios.get(API.apiRoute("/recurso/" + req.params.id + "?token=" + req.cookies.token))
        .then((resp) => {
          recurso = resp.data;
          let oldFilePath = recurso.filePath ? path.join(__dirname, "/../public/fileStore/", recurso.filePath) : null;

          let oldPath = path.join(__dirname, "/../", req.file.path);
          let newPath = path.join(__dirname, "/../public/fileStore/", req.file.originalname);

          if (oldFilePath) {
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.error("Erro ao remover o arquivo antigo: ", err);
                return res.status(500).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
              }

              // Move the new file
              fs.rename(oldPath, newPath, (error) => {
                if (error) {
                  console.error("Erro ao renomear o arquivo: ", error);
                  return res.status(500).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
                }

                // Update the file path in the recurso object
                req.body.filePath = req.file.originalname;

                var recurso = req.body;
                console.log(recurso);

                axios.put(API.apiRoute("/recurso/" + req.params.id + "?token=" + req.cookies.token), recurso)
                  .then((resp) => {
                    req.session.message = "Recurso editado com sucesso!";
                    res.redirect("/recurso/" + req.params.id);
                  })
                  .catch((erro) => {
                    res.status(503).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
                  });
              });
            });
          }
        })
        .catch((erro) => {
          res.status(502).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
        });
    } else {
      var recurso = req.body;

      axios.put(API.apiRoute("/recurso/" + req.params.id + "?token=" + req.cookies.token), recurso)
        .then((resp) => {
          req.session.message = "Recurso editado com sucesso!";
          res.redirect("/recurso/" + req.params.id);
        })
        .catch((erro) => {
          res.status(503).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
        });
    }
  }
);

router.get("/delete/:id", Auth.verifyAcess, function (req, res, next) {
  axios.get(API.apiRoute("/recurso/" + req.params.id + "?token=" + req.cookies.token))
    .then((resp) => {
      var recurso = resp.data;

      let oldPath = path.join(__dirname, "/../public/fileStore/", recurso.filePath);

      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error("Erro ao remover o arquivo antigo: ", err);
          return res.status(500).render("error", {title : 'Erro', error: err, userRole : req.userRole });
        } else {
          console.log("Ficheiro removido!");
        }
      });

      axios.delete(API.apiRoute("/recurso/" + req.params.id + "?token=" + req.cookies.token))
        .then((resp1) => {
          console.log("Recurso eliminado com sucesso!");
          req.session.message = "Recurso eliminado com sucesso!";
          res.redirect("/curso/" + recurso.cursoId);
        })
        .catch((erro) => {
          res.status(503).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
        });
    });
});

router.post("/classificar/:id", Auth.verifyAcess, function (req, res, next) {
  req.body.idUtilizador = "20";

  var result = req.body;

  axios.put(API.apiRoute("/recurso/classificar/" + req.params.id + "?token=" + req.cookies.token), result)
    .then((resp) => {
      console.log("Recurso classificado com sucesso!");
      res.redirect("/recurso/" + req.params.id);
    })
    .catch((error) => {
      res.status(506).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
    });
});

router.post("/addFavourite/:id", Auth.verifyAcess, function (req, res) {
  let userID = req.userID;
  axios
    .post(
      API.apiRoute(
        `/users/${userID}/favoritos/recurso?token=${req.cookies.token}`
      ),
      req.body
    )
    .then((result) => {
      if (result.status == 200) {
        res.status(200).jsonp("Sucesso");
      } else {
        res.status(500).jsonp("Erro");
      }
    })
    .catch((error) => {
      res.status(500).jsonp("Erro");
    });
});

router.post("/removeFavourite/:id", Auth.verifyAcess, function (req, res) {
  let userID = req.userID;
  axios
    .delete(
      API.apiRoute(
        `/users/${userID}/favoritos/recurso?id=${req.body.id}&token=${req.cookies.token}`
      )
    )
    .then((result) => {
      if (result.status == 200) {
        res.status(200).jsonp("Sucesso");
      } else {
        res.status(500).jsonp("Erro");
      }
    })
    .catch((error) => {
      res.status(500).jsonp("Erro");
    });
});

router.get('/bloquear/:id', Auth.verifyAcess, function(req, res, next) {
    axios.get(API.apiRoute('/recurso/' + req.params.id + '?token=' + req.cookies.token))
        .then(resp => {
            var recurso = resp.data
            recurso.visibilidade = false

            axios.put(API.apiRoute('/recurso/' + req.params.id + '?token=' + req.cookies.token), recurso)
                .then(resp1 => {
                    console.log("Recurso Bloqueado com sucesso!")
                    req.session.message = "Recurso Bloqueado com sucesso!";
                    res.redirect('/curso/' + recurso.cursoId)
                })
                .catch(erro => {
                    res.status(503).render("error", {title : 'Erro', error: erro, userRole : req.userRole })
                })
        })
});

router.get('/desbloquear/:id', Auth.verifyAcess, function(req, res, next) {
    axios.get(API.apiRoute('/recurso/' + req.params.id + '?token=' + req.cookies.token))
        .then(resp => {
            var recurso = resp.data
            recurso.visibilidade = true

            axios.put(API.apiRoute('/recurso/' + req.params.id + '?token=' + req.cookies.token), recurso)
                .then(resp1 => {
                    console.log("Recurso Desbloqueado com sucesso!")
                    req.session.message = "Recurso Desbloqueado com sucesso!";
                    res.redirect('/curso/' + recurso.cursoId)
                })
                .catch(erro => {
                    res.status(503).render("error", {title : 'Erro', error: erro, userRole : req.userRole })
                })
        })
});

router.get('/publicacao/:id', Auth.verifyAcess, function(req, res, next) {
  axios.get(API.apiRoute('/recurso/' + req.params.id + '?token=' + req.cookies.token))
      .then(resp => {
          var recurso = resp.data
          res.status(200).render("PublicacaoRecurso", {Recurso : recurso})
      })
      .catch(erro => {
        res.status(503).render("error", {"error" : erro})
    })
});

router.post('/publicacao/adicionar/:id', Auth.verifyAcess, function(req, res, next) {
  axios.get(API.apiRoute('/recurso/' + req.params.id + '?token=' + req.cookies.token))
      .then(resp => {
          var recurso = resp.data

          const uniqueId = uuidv4();

          req.body._id = uniqueId
          req.body.cursoId = recurso.cursoId
          req.body.idRecurso = recurso._id
          req.body.dataRegisto = Date.now()
          req.body.idAutor = req.userID
          req.body.autor = req.userName
          req.body.listaComentarios = []

          var result = req.body

          axios.post(API.apiRoute('/publicacao?token=' + req.cookies.token), result)
            .then(resp => {
                console.log("Publicação criada com sucesso!")
                res.status(200).redirect('/publicacao/' + result._id)
            })
            .catch(erro => {
                res.status(503).render("error", {"error" : erro})
            })
      })
      .catch(erro => {
        res.status(503).render("error", {"error" : erro})
    })
});

router.get("/:id", Auth.verifyAcess, function (req, res, next) {
  axios.get(API.apiRoute("/recurso/" + req.params.id + "?token=" + req.cookies.token))
    .then((resp1) => {
      var recurso = resp1.data;
      recurso.dataCriacao = new Date(recurso.dataCriacao).toISOString().split("T")[0];
      recurso.dataRegisto = new Date(recurso.dataRegisto).toISOString().split("T")[0];
      axios.get(API.apiRoute("/publicacao?idRecurso=" +req.params.id + "&token=" + req.cookies.token))
        .then((resp2) => {
          var posts = resp2.data;
          axios.get(API.apiRoute("/tipoRecurso/" + recurso.tipo + "?token=" + req.cookies.token))
            .then((resp3) => {
              axios.get(API.apiRoute(`/users/${req.userID}/favoritos/recurso?id=${recurso._id}&token=${req.cookies.token}`))
                .then((info) => {
                  var tipoRecurso = resp3.data;
                  axios.get(API.apiRoute("/curso/" + recurso.cursoId + "?token=" + req.cookies.token))
                    .then((resp4) => {
                      axios.get(API.apiRoute(`/users/${recurso.idProdutor}?token=${req.cookies.token}`))
                        .then((resp5) => {
                          var produtor = resp5.data
                          let isFav = info.data.isFav
                          var curso = resp4.data;
                          console.log(recurso)
                          res.status(200).render("paginaRecurso", {
                            title : 'Recurso ' + recurso.titulo,
                            Recurso: recurso,
                            Posts: posts,
                            TipoRecurso: tipoRecurso,
                            Curso: curso,
                            isFavorite : isFav,
                            userRole : req.userRole,
                            Produtor : produtor
                          });
                        })
                      
                    });
                });
            });

        })
        .catch((erro) => {
          res.status(502).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
        });
    })
    .catch((erro) => {
      res.status(503).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
    });
});

router.post("/adicionarJson", Auth.verifyAcessProducer, upload.fields([{ name: "jsonFile", maxCount: 1 }, { name: "zipFile", maxCount: 1 },]), function (req, res, next) {
    const jsonFile = req.files["jsonFile"][0];
    const zipFile = req.files["zipFile"][0];

    if (!jsonFile || !zipFile) {
      console.error("Nenhum arquivo foi enviado");
      return res
        .status(400)
        .render("error", { error: "Nenhum arquivo foi enviado" });
    }

    const jsonFilePath = path.join(__dirname, "/../", jsonFile.path);
    const zipFilePath = path.join(__dirname, "/../", zipFile.path);

    const extractPath = path.join(__dirname, "/../public/fileStore/temp/");
    fs.mkdirSync(extractPath, { recursive: true });

    // Extrair o arquivo ZIP
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(extractPath, true);

    // Leitura do conteúdo do arquivo JSON
    fs.readFile(jsonFilePath, (err, data) => {
      if (err) {
        console.error("Erro ao ler o arquivo JSON:", err);
        return res.status(500).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
      }

      try {
        const recursos = JSON.parse(data);

        // Para cada recurso no JSON, associar o caminho do arquivo extraído e fazer o upload
        recursos.forEach((recurso) => {
          const originalFileName = recurso.filePath;
          const extractedFilePath = path.join(extractPath, originalFileName);

          // Verifica se o arquivo existe no ZIP extraído
          if (fs.existsSync(extractedFilePath)) {
            const newFilePath = path.join(
              __dirname,
              "/../public/fileStore/",
              originalFileName
            );

            // Mover o arquivo extraído para o diretório final
            fs.renameSync(extractedFilePath, newFilePath);

            // Atualiza o caminho do arquivo no recurso
            recurso.filePath = originalFileName;

            const uniqueId = uuidv4();
            recurso._id = uniqueId;
            recurso.dataRegisto = Date.now();
            recurso.idProdutor = req.userID; // Ajuste conforme necessário
            recurso.classificacao = [];

            // Capturar campos personalizados diretamente
            let predefinedFields = [
              "_id",
              "tipo",
              "tema",
              "cursoId",
              "titulo",
              "subtitulo",
              "dataRegisto",
              "dataCriacao",
              "idProdutor",
              "autor",
              "visibilidade",
              "classificacao",
              "filePath",
            ];
            let customFields = {};
            Object.keys(recurso).forEach((key) => {
              if (!predefinedFields.includes(key)) {
                customFields[key] = recurso[key];
              }
            });
            recurso.customFields = customFields;

            // Fazer o upload do recurso
            axios.post(API.apiRoute("/recurso?token=" + req.cookies.token), recurso)
              .then((resp) => {
                axios.put(API.apiRoute("/curso/" + recurso.cursoId + "/recurso?token=" + req.cookies.token), { recursoId: recurso._id })
                  .then((respo) => {
                    console.log("Recursos adicionados com sucesso!");
                  })
                  .catch((erro) => {
                    console.error("Erro ao adicionar recurso ao curso:", erro);
                  });
              })
              .catch((error) => {
                console.error("Erro ao adicionar recurso:", error);
              });
          } else {
            console.error("Arquivo não encontrado no ZIP:", originalFileName);
          }
        });

        res.status(201).redirect("/curso/" + recursos[0].cursoId);
      } catch (error) {
        console.error("Erro ao analisar o conteúdo JSON:", error);
        return res.status(500).render("error", {title : 'Erro', error: erro, userRole : req.userRole });
      }
    });
});

module.exports = router;
