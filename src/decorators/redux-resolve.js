import React, { Component, PropTypes } from 'react';

export default function resolve(actionName, condition = null) {
  return function decorate(DecoratedComponent) {
    return class extends Component {
      static contextTypes = {
        store: PropTypes.object.isRequired
      }

      componentWillMount() {
        const { resolver, getState } = this.context.store;
        if ((!condition || condition(getState())) && this.props[actionName]) {
          resolver.resolve(this.props[actionName]);
        }
      }

      render() {
        return (
          <DecoratedComponent {...this.props} />
        );
      }
    };
  };
}
