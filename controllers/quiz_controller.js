var models = require('../models/models.js');

// // GET /quizes/question
// exports.question= function(req, res ){
//   //res.render('quizes/question', {pregunta: 'Capital de Italia'});
//   models.Quiz.findAll().success(function(quiz) {
//     res.render('quizes/question', { pregunta: quiz[0].pregunta});
//   })
// };

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
    var filtro  = (req.query.search || '').replace(" ", "%");
    models.Quiz.findAll({where:["pregunta like ?", '%'+filtro+'%'],order:'pregunta ASC'}).then(function(quizes){

//models.Quiz.2findAll().then(function(quizes) {
    res.render('quizes/index.ejs', { quizes: quizes, errors: []});
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
  // models.Quiz.find(req.params.quizId).then(function(quiz) {
  //   res.render('quizes/show', { quiz: quiz});
  // })
   res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')})
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
 };

 // GET /quizes/:id/edit
 exports.edit = function(req, res) {
   var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

   res.render('quizes/edit', {quiz: quiz, errors: []});
 };

  // PUT /quizes/:id
 exports.update = function(req, res) {
   req.quiz.pregunta  = req.body.quiz.pregunta;
   req.quiz.respuesta = req.body.quiz.respuesta;

   req.quiz
   .validate()
   .then(
     function(err){
       if (err) {
         res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
       } else {
         req.quiz     // save: guarda campos pregunta y respuesta en DB
         .save( {fields: ["pregunta", "respuesta"]})
         .then( function(){ res.redirect('/quizes');});
       }     // Redirección HTTP a lista de preguntas (URL relativo)
     }
   );
 };

// GET /quizes/answer
exports.answer= function(req, res ){
  // if (req.query.respuesta ==='Roma'){
  //   res.render('quizes/answer', {respuesta: 'Correcta'});
  // } else {
  //   res.render('quizes/answer', {respuesta: 'Incorrecta'});
  // };
  //busqueda cuando habia solo una pregunta
  // models.Quiz.findAll().success(function(quiz) {
  //    if (req.query.respuesta === quiz[0].respuesta) {
  //      res.render('quizes/answer', { respuesta: 'Correcto' });
  //     } else {
  //       res.render('quizes/answer', { respuesta: 'Incorrecto'});
  //     }
  //   })
  //models.Quiz.find(req.params.quizId).then(function(quiz) {
    // if (req.query.respuesta === quiz.respuesta) {
    //   res.render('quizes/answer',
    //              { quiz: quiz, respuesta: 'Correcto' });
    // } else {
    //   res.render('quizes/answer',
    //              { quiz: quiz, respuesta: 'Incorrecto'});
    // }
    // })
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz,
     respuesta: resultado,
     errors: []
   });
};
// GET /quizes/author
exports.author= function(req, res ){
  res.render('quizes/author', { errors: []});
};
