import {EntityRepository , Repository} from 'typeorm'

import Activity from '../models/Activity'

@EntityRepository(Activity)
class ActivitiesRepository extends Repository<Activity> {

  public async findByName(name : string) : Promise<Activity | null> {

    const findActivity = await this.findOne({where : {name : name}})
    
    return findActivity || null;
  }

}

export default ActivitiesRepository;