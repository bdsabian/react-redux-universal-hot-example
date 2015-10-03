// Borrow from:
// https://github.com/savemysmartphone/universal-redux-boilerplate
// https://github.com/lancetw/react-isomorphic-bundle/

export default class ReduxResolver {

  constructor() {
    this.pending = [];
    this.firstRender = true;
  }

  resolve(...theArgs) {
    const [action, ...args] = theArgs;
    if (__CLIENT__ && !this.firstRender) {
      return action(...args);
    }

    this.pending = [
      ...this.pending,
      { action, args }
    ];
  }

  async dispatchAll() {
    await Promise.all(
      this.pending.map(({ action, args }) => action(...args)));
  }

  clear() {
    this.pending = [];
    this.firstRender = false;
  }
}
