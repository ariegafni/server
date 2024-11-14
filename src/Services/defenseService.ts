// DefenseService.ts
import Organization from "../models/organization";
import Missile from "../models/missile";
import { io } from '../app';

class DefenseService {
  async getDefenseSystems(area: string) {
    try {
      const org = await Organization.findOne({ name: `IDF - ${area}` });
      if (!org) throw new Error('Area not found');
      return org.resources;
    } catch (error) {
      throw error;
    }
  }

  async attemptIntercept(data: {
    interceptorType: string,
    defenderArea: string,
    incomingMissileId: string
  }) {
    try {
      const defender = await Organization.findOne({ name: `IDF - ${data.defenderArea}` });
      if (!defender) throw new Error('Defender not found');

      const interceptor = await Missile.findOne({ name: data.interceptorType });
      if (!interceptor) throw new Error('Interceptor not found');

      const result = {
        success: true,
        interceptorDetails: interceptor,
        interceptTime: Date.now()
      };
      io.emit('intercept-result', result);

      return result;
    } catch (error) {
      throw error;
    }
  }
  //להשלים את הפונקציה לקבל את הטילים  הפעילים לאזור
  async getActiveThreats(area: string) {
    try {
     
      return [];
    } catch (error) {
      throw error;
    }
  }
}

export default new DefenseService();