import HttpRepository from '../httpRepository';

class GoogleCalendarRepository extends HttpRepository {
  constructor() {
    super({});
  }

  authUrl = async () => {
    return await this.request({
      method: 'get',
      url: `/google-calendar/auth-url`,
			params: { returnUrl: window.location.pathname }
    });
  };

  disconnect = async () => {
    return await this.request({ method: 'post', url: '/google-calendar/disconnect' });
  };
}

export const GoogleCalendar = new GoogleCalendarRepository();
