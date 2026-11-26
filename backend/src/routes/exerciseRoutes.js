const router = require('express').Router();
const { z } = require('zod');
const controller = require('../controllers/exerciseController');
const validate = require('../validators/validate');
const fields = z.object({title:z.string().trim().min(1).max(180),subject:z.string().trim().min(1).max(100),statement:z.string().trim().min(1).max(6000),options:z.array(z.string().trim().min(1).max(500)).max(6).optional(),answer:z.string().trim().min(1).max(500),explanation:z.string().max(6000).optional(),difficulty:z.enum(['easy','medium','hard']).optional()});
router.post('/generate', validate(z.object({subject:z.string().trim().min(2).max(100),difficulty:z.enum(['easy','medium','hard'])})), controller.generate);
router.route('/').get(controller.list).post(validate(fields),controller.create);
router.route('/:id').get(controller.get).put(validate(fields.partial()),controller.update).delete(controller.remove);
module.exports = router;
