import React, { Component, PropTypes } from 'react';

export default function resolve(doResolve) {
  return function decorate(DecoratedComponent) {
    return class extends Component {
      static contextTypes = {
        store: PropTypes.object.isRequired
      }

      componentWillMount() {
        const { resolver, getState } = this.context.store;

        doResolve(resolver, this.props, getState);
      }

      render() {
        return (
          <DecoratedComponent {...this.props} />
        );
      }
    };
  };
}
