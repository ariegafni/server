// gameRoutes.ts:
import express from 'express';
import GameService from '../Services/attackService';
import Organization from '../models/organization';
import Missile from '../models/missile';

const router = express.Router();


router.get('/organization/:name', async (req : any, res: any) => {
  try {
    const organization = await Organization.findOne({ name: req.params.name });
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


router.get('/missiles/:orgName', async (req : any, res: any) => {
  try {
    const organization = await Organization.findOne({ name: req.params.orgName });
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
   
    const missiles = await Promise.all(
      organization.resources.map(async (resource) => {
        const missileDetails = await Missile.findOne({ name: resource.name });
        return {
          ...resource.toObject(),
          details: missileDetails
        };
      })
    );
    
    res.json(missiles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


router.post('/launch', async (req : any, res: any)=> {
  try {
    const { missileType, sourceOrg, targetArea } = req.body;
    console.log('Launch request body:', req.body);
    
    if (!missileType || !sourceOrg || !targetArea) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await GameService.handleMissileLaunch({
      missileType,
      sourceOrg,
      targetArea,
      launchTime: Date.now()
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});


router.post('/intercept', async (req : any, res: any) => {
  try {
    const { interceptorType, defenderOrg, targetMissile } = req.body;
    
    if (!interceptorType || !defenderOrg || !targetMissile) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await GameService.handleInterceptAttempt({
      interceptorType,
      defenderOrg,
      targetMissile,
      interceptTime: Date.now()
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// router.get('/getallmissiles', async (req : any, res: any) => {
//   try {
//     const missiles = await Missile.find();
//     res.json(missiles);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// router.get('/getallorganizations', async (req : any, res: any) => {
//   try {
//     const organizations = await Organization.find();
//     res.json(organizations);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

export default router;