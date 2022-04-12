import express from 'express'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/auth/sigin')
  .post(authCtrl.signin)
router.route('/auth/signout')
  .gt(authCtrl.signout)


export default router
