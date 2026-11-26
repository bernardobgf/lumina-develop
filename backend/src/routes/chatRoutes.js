const router = require('express').Router();
const controller = require('../controllers/chatController');
const validate = require('../validators/validate');
const { createChatSchema, updateChatSchema, messageSchema } = require('../validators/chatValidator');
router.route('/').get(controller.list).post(validate(createChatSchema), controller.create);
router.route('/:id').get(controller.get).put(validate(updateChatSchema), controller.update).delete(controller.remove);
router.post('/:id/messages', validate(messageSchema), controller.addMessage);
router.post('/:id/ask', validate(require('zod').z.object({ content: require('zod').z.string().trim().min(1).max(12000) })), controller.ask);
module.exports = router;
