import request from '@/config/http'

export default {
  login: (data: object) =>
    request(
      {
        url: '/user/usrLogin',
        method: 'POST',
        params: data,
      }
    ),
}
