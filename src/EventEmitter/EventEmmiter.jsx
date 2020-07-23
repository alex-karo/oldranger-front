class EventEmitter {
  constructor() {
    this.subscribers = [];
  }

  subscribe = subscriber => {
    this.subscribers.push(subscriber);
  };

  emit = event => {
    this.subscribers.forEach(subscriber => subscriber(event));
  };
}

const AuthorizationStatusEmitter = new EventEmitter();
export default AuthorizationStatusEmitter;
