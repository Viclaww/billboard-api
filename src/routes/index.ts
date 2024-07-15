import express, { IRouter } from 'express';
import userRoute from './user.route';
import uploadToCloudinary from '../config/multer';
import BillboardRoutes from './billboard.route';

const router = express.Router();
/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });

  // router.post('/upload', uploadToCloudinary, (req, res) => {
  //   console.log('came here');
  //   if (!req.fileUrl) {
  //     console.log(req.fileUrl);

  //     return res.status(500).json({ error: 'File upload failed' });
  //   }
  //   return res.json({ fileUrl: req.fileUrl });
  // });

  router.use('/auth', new userRoute().getRoutes());
  router.use('/billboards', new BillboardRoutes().getRoutes());

  return router;
};

export default routes;
