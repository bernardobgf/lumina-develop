const router = require('express').Router();
const { z } = require('zod');
const controller = require('../controllers/authController');
const validate = require('../validators/validate');

const credentialsSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(72)
});
router.post('/register', validate(credentialsSchema.extend({ name: z.string().trim().min(2).max(80) })), controller.register);
router.post('/login', validate(credentialsSchema.omit({ name: true })), controller.login);
module.exports = router;
