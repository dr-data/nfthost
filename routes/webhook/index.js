const router = require('express').Router();
const controller = require('./controller');
const { verifyGithubPayload } = require('../../middlewares/github')

router.delete('/', verifyGithubPayload);
router.post('/', controller.receive);

router.get('/get', controller.retrieve);

module.exports = router;