import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import {connect} from 'react-redux';
import * as widgetActions from 'redux/modules/widgets';
import {isLoaded} from 'redux/modules/widgets';
import {initializeWithKey} from 'redux-form';
import { WidgetForm } from 'components';

@connect(
  state => ({
    widgets: state.widgets.data,
    editing: state.widgets.editing,
    error: state.widgets.error,
    loading: state.widgets.loading
  })
)
export default
class Widgets extends Component {
  static propTypes = {
    widgets: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    editing: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const { resolver, getState } = this.context.store;
    this.actions = bindActionCreators( {
      ...widgetActions,
      initializeWithKey
    }, dispatch);

    if (!isLoaded(getState())) {
      return resolver.resolve(this.actions.load);
    }
  }

  handleEdit(widget) {
    const {editStart} = this.actions; // eslint-disable-line no-shadow
    return () => {
      editStart(String(widget.id));
    };
  }

  render() {
    const {widgets, error, editing, loading} = this.props;
    const {load} = this.actions;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./Widgets.scss');
    return (
      <div className={styles.widgets + ' container'}>
        <h1>
          Widgets
          <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}><i
            className={refreshClassName}/> {' '} Reload Widgets
          </button>
        </h1>
        <DocumentMeta title="React Redux Example: Widgets"/>
        <p>
          This data was loaded from the server before this route was rendered. If you hit refresh on your browser, the
          data loading will take place on the server before the page is returned. If you navigated here from another
          page, the data was fetched from the client.
        </p>
        <p>
          This widgets are stored in your session, so feel free to edit it and refresh.
        </p>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}
        {widgets && widgets.length &&
        <table className="table table-striped">
          <thead>
          <tr>
            <th className={styles.idCol}>ID</th>
            <th className={styles.colorCol}>Color</th>
            <th className={styles.sprocketsCol}>Sprockets</th>
            <th className={styles.ownerCol}>Owner</th>
            <th className={styles.buttonCol}></th>
          </tr>
          </thead>
          <tbody>
          {
            widgets.map((widget) => editing[widget.id] ?
              <WidgetForm formKey={String(widget.id)} key={String(widget.id)} initialValues={widget}/> :
              <tr key={widget.id}>
                <td className={styles.idCol}>{widget.id}</td>
                <td className={styles.colorCol}>{widget.color}</td>
                <td className={styles.sprocketsCol}>{widget.sprocketCount}</td>
                <td className={styles.ownerCol}>{widget.owner}</td>
                <td className={styles.buttonCol}>
                  <button className="btn btn-primary" onClick={::this.handleEdit(widget)}>
                    <i className="fa fa-pencil"/> Edit
                  </button>
                </td>
              </tr>)
          }
          </tbody>
        </table>}
      </div>
    );
  }
}

