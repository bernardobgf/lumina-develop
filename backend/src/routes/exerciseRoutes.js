const router = require('express').Router();
const controller = require('../controllers/exerciseController');
router.route('/').get(controller.list).post(controller.create);
router.route('/:id').get(controller.get).put(controller.update).delete(controller.remove);
module.exports = router;
