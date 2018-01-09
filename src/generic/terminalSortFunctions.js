import classNames from 'classnames';
export function onColumnSort(column) {
  const currentSortDirection = this.state.sort.direction;
  let direction;
  if(this.state.sort.column === column) {
    direction = currentSortDirection === 'down' ? 'up' : 'down';
  } else {
    direction = 'up';
  }

  this.setState({sort: {column: column, direction}});
}

export function sortData(data) {
  if(!this.state.sort.column) {
    return data;
  }
  const sortFunction = this.sortFunctions[this.state.sort.column] || defaultSortFunction(this.state.sort.column);
  const sorted = [...data].sort(sortFunction);
  if(this.state.sort.direction === 'up') {
    sorted.reverse();
  }
  return sorted;
}

export function defaultSortFunction(column) {
  return (a, b) => {
    if(a[column] > b[column]) {
      return 1;
    } else if(a[column] < b[column]) {
      return -1;
    } else {
      return 0;
    }
  };
}

export function classNameForColumnHeader(state, column) {
  const names = ['icon-dir'];
  if(state.sort.column === column &&
     state.sort.direction === 'up') {
    names.push('icon-up-dir');
  } else {
    names.push('icon-down-dir');
  }
  return classNames(names);
}
