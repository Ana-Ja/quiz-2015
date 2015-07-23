var models = require('../models/models.js');

exports.statistics = function(req,res){
	models.Quiz.count().then(function(count_quiz){ // Total de preguntas
		var tquiz = count_quiz;
		models.Comment.count().then(function(count_comment){ // Total de comentarios
			var tcomment = count_comment;
			var media = (tcomment / tquiz).toFixed(2) || 0;	// Media de comentarios por pregunta
			models.Quiz.count({distinct: true, include: [{model: models.Comment, required: true}]}).then(function(con_comments) {
				console.log('CON COMENTARIOS = '+con_comments);
				var sin_comment=tquiz-con_comments;	// Preguntas sin comentarios.
				console.log('SIN COMENTARIOS = '+sin_comment);
				res.render('estadistic', {tquiz: tquiz, tcomment: tcomment, media: media, tquiz_comment: con_comments, tquiz_sin_comment: sin_comment, errors: []});
			});
		});
	});
}
