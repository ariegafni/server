// defenseRoutes.ts:
import express from 'express';
import DefenseService from '../Services/defenseService';

const router = express.Router();

//  מערכות הגנה לפי אזור
router.get('/systems/:area', async (req, res) => {
  try {
    const systems = await DefenseService.getDefenseSystems(req.params.area);
    res.json(systems);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// קבלת איומים פעילים לפי לאזור
router.get('/threats/:area', async (req, res) => {
  try {
    const threats = await DefenseService.getActiveThreats(req.params.area);
    res.json(threats);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// ניסיון יירוט
router.post('/intercept', async (req, res) => {
  try {
    const { interceptorType, defenderArea, incomingMissileId } = req.body;
    const result = await DefenseService.attemptIntercept({
      interceptorType,
      defenderArea,
      incomingMissileId
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;