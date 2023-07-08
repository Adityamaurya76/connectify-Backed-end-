const requireUser =require('../middlewares/requireUser');
const UserController =require('../controllers/userController');
const router= require('express').Router();

router.post('/follow',requireUser,UserController.followOrUnFollowUserController);
router.get('/getFeedData',requireUser,UserController.getPostOfFollowing);
router.get('/getMyPosts' , requireUser ,UserController.getMyPost);
router.get('/getuserPosts',requireUser,UserController.getUserPosts);
router.delete('/', requireUser, UserController.deleteMyProfile);
router.get('/getMyInfo', requireUser ,UserController.getMyInfo);
router.put('/',requireUser ,UserController.updataUserProfile);
router.post('/getUserProfile' , requireUser, UserController.getUserProfile);

module.exports =router;