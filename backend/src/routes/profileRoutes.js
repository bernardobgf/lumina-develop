const router = require('express').Router();
const { z } = require('zod');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Exercise = require('../models/Exercise');
const AppError = require('../utils/AppError');
const validate = require('../validators/validate');
const asyncHandler = require('../middlewares/asyncHandler');
const requireAuth = require('../middlewares/requireAuth');
router.use(requireAuth);
router.patch('/', validate(z.object({name:z.string().trim().min(2).max(80),avatar:z.string().max(350000).refine(x=>!x || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(x))})), asyncHandler(async(req,res)=>{
  const user = await User.findByIdAndUpdate(req.user.id,req.body,{new:true,runValidators:true});
  if (!user) throw new AppError('Conta não encontrada.',404);
  res.json({data:{id:user.id,name:user.name,email:user.email,avatar:user.avatar}});
}));
router.delete('/', validate(z.object({password:z.string().min(1).max(72)})), asyncHandler(async(req,res)=>{
  const user = await User.findById(req.user.id).select('+password');
  if (!user || !await bcrypt.compare(req.body.password,user.password)) throw new AppError('Senha incorreta.',403);
  await Chat.deleteMany({ownerId:req.user.id});
  await Exercise.deleteMany({ownerId:req.user.id});
  await user.deleteOne();
  res.status(204).send();
}));
module.exports = router;
