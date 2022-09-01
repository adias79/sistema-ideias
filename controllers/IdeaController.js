const Idea = require('../models/Idea');
const User = require('../models/User');
const { Op } = require('sequelize');


module.exports = class IdeaController {
    
    static async showIdeas(req, res) {
        
        let search = '';

        if(req.query.search) {
            search = req.query.search;
        }

        let order = 'DESC';

        if(req.query.order === 'old') {
            order = 'ASC';
        }

        const ideasData = Idea.findAll({
            include: User,
            where: {
                description: { [Op.like]: `%${search}%` },
            },
            order: [['createdAt', order]],
        });

        const ideas = (await ideasData).map((result) => result.get({ plain: true }));

        let ideasQty = ideas.length;

        res.render('ideas/home', { ideas, search, ideasQty});
    }

    static async idealize(req, res) {
        
        const userId = req.session.userid;

        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: Idea, 
            plain: true
        })
        
        // check user exists
        if(!user) {
            res.redirect('/login');
        }

        const ideas = user.Ideas.map((result) => result.dataValues);

        res.render('ideas/idealize', { ideas });
    }

    static createIdea(req, res) {
        
        res.render('ideas/create');
    }

    static async createIdeaSave(req, res) {
        
        const idea = {
            description: req.body.description,
            UserId: req.session.userid, 
        }

        try {
            await Idea.create(idea);

            req.flash('message', 'Ideia registrada!');

            req.session.save(() => res.redirect('/ideas/idealize'));

        } catch(err) {
            console.log(err);
        }
    }

    static async removeIdea(req, res) {
        
        const id = req.body.id;
        const UserId = req.session.userid;
        
        try {
            await Idea.destroy({ where: { id: id, UserId: UserId} });

            req.flash('message', 'Ideia excluída!');

            req.session.save(() => res.redirect('/ideas/idealize'));

        } catch (err) {
            console.log(err);   
        }
    }

    static async updateIdea(req, res) {
        
        const id = req.params.id;
        
        const idea = await Idea.findOne({ where: { id: id }, raw: true });

        console.log(idea)

        res.render('ideas/edit', { idea });
    }    

    static async updateIdeaSave(req, res) {
    
        const id = req.body.id;

        const idea = {
            description: req.body.description,
        }

        try {
            await Idea.update(idea, { where: { id: id } });

            req.flash('message', 'Ideia alterada!');

            req.session.save(() => res.redirect('/ideas/idealize'));

        } catch(err) {
            console.log(err);
        }
    }
}
