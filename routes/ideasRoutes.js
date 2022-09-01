const express = require('express');
const router = express.Router();
const IdeaController = require('../controllers/IdeaController');

//helpers
const checkAuth = require('../helpers/auth').checkAuth;

router.get('/add', checkAuth, IdeaController.createIdea);
router.post('/add', checkAuth, IdeaController.createIdeaSave);
router.get('/idealize', checkAuth, IdeaController.idealize);
router.get('/edit/:id', checkAuth, IdeaController.updateIdea);
router.post('/edit', checkAuth, IdeaController.updateIdeaSave);
router.post('/remove', checkAuth, IdeaController.removeIdea);
router.get('/', IdeaController.showIdeas);

module.exports = router;