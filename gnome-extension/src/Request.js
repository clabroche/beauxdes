const Soup = imports.gi.Soup;

function makeRequest(method, url = '/', params = {}, headers = {}) {
  return new Promise((res, rej) => {
    let _httpSession = new Soup.Session();
    let message = Soup.Message.new(method, url);
    Object.keys(headers).forEach(key => {
      message.request_headers.append(key, headers[key]);
    })
    _httpSession.queue_message(message, function (_httpSession, message) {
      if (message.status_code !== 200) {
        logInSystem(message)
        return rej(message)
      };
      let json = JSON.parse(message.response_body.data);
      res(json)
    });
  })
}
module.exports = makeRequest