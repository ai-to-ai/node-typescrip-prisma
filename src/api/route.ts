import Router from 'koa-router'
import InscriptionController from './controllers/InscriptionController'

const router = new Router()

router.get('/getinscription', InscriptionController.getInscription)
router.get('/getinscriptionbyaddress', InscriptionController.getInscriptionByAddress)
router.get('/getlastestinscription', InscriptionController.getLastestInscription)
router.get('/getinscriptioninrange', InscriptionController.getInscriptionInRange)
router.get('/content', InscriptionController.getContentFromInscription)


export default router 