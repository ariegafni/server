// GameService.ts:
import { io } from '../app';
import Missile from '../models/missile';
import Organization from '../models/organization';


interface IResource {
  name: string;
  amount: number;
}

interface IMissile {
  name: string;
  speed: number;
  intercepts: string[];
}

class GameService {
  async handleMissileLaunch(data: {
    missileType: string,
    sourceOrg: string,
    targetArea: string,
    launchTime: number
  }) {
    try {
      const organization = await Organization.findOne({ name: data.sourceOrg });
      if (!organization) {
        throw new Error('Organization not found');
      }

      const missileResource = organization.resources.find(r => r.name === data.missileType) as IResource;
      if (!missileResource || missileResource.amount <= 0) {
        throw new Error('No missiles available');
      }

      const missile = await Missile.findOne({ name: data.missileType }) as IMissile;
      if (!missile || !missile.speed) {
        throw new Error('Invalid missile data');
      }

      const estimatedImpactTime = this.calculateImpactTime(missile.speed);

      await Organization.updateOne(
        { name: data.sourceOrg, 'resources.name': data.missileType },
        { $inc: { 'resources.$.amount': -1 } }
      );

      io.emit('missile-launched', {
        ...data,
        missileSpeed: missile.speed,
        estimatedImpactTime,
      });

      return {
        success: true,
        estimatedImpactTime,
        missileDetails: missile
      };
    } catch (error) {
      console.error('Launch error:', error);
      throw error;
    }
  }

  async handleInterceptAttempt(data: {
    interceptorType: string,
    defenderOrg: string,
    targetMissile: string,
    interceptTime: number
  }) {
    try {
      const organization = await Organization.findOne({ name: data.defenderOrg });
      if (!organization) {
        throw new Error('Organization not found');
      }

      const interceptorResource = organization.resources.find(r => r.name === data.interceptorType) as IResource;
      if (!interceptorResource || interceptorResource.amount <= 0) {
        throw new Error('No interceptors available');
      }

      const interceptor = await Missile.findOne({ name: data.interceptorType }) as IMissile;
      const incomingMissile = await Missile.findOne({ name: data.targetMissile }) as IMissile;

      if (!interceptor || !incomingMissile || !interceptor.speed || !incomingMissile.speed) {
        throw new Error('Invalid missile data');
      }

      const canIntercept = interceptor.intercepts.includes(data.targetMissile);
      const interceptProbability = this.calculateInterceptProbability(interceptor, incomingMissile);
      
      await Organization.updateOne(
        { name: data.defenderOrg, 'resources.name': data.interceptorType },
        { $inc: { 'resources.$.amount': -1 } }
      );

      const isSuccessful = Math.random() < interceptProbability;

      io.emit('intercept-result', {
        ...data,
        success: isSuccessful,
        interceptorSpeed: interceptor.speed,
      });

      return {
        success: true,
        interceptResult: isSuccessful,
        interceptorDetails: interceptor
      };
    } catch (error) {
      console.error('Intercept error:', error);
      throw error;
    }
  }

  private calculateImpactTime(missileSpeed: number): number {
    return Date.now() + (missileSpeed * 1000);
  }

  private calculateInterceptProbability(interceptor: IMissile, incomingMissile: IMissile): number {
    if (!interceptor.intercepts.includes(incomingMissile.name)) {
      return 0;
    }
    
    const baseChance = 0.7;
    const speedFactor = interceptor.speed / incomingMissile.speed;
    return Math.min(baseChance * speedFactor, 0.9);
  }
}

export default new GameService();