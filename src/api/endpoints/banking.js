import HttpRepository from '../httpRepository';

class BankingRepository extends HttpRepository {
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