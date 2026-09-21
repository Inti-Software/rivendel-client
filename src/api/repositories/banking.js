import BaseRepository from './base-repository';

class BankingRepository extends BaseRepository {
  constructor() {
    super({});
  }

  async getData(alias) {
    return await this.request({
      method: 'get',
      url: `/banking/data`,
      params: { alias }
    });
  }
}

export const Banking = new BankingRepository();