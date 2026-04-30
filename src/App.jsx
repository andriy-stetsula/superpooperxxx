/* eslint-disable jsx-a11y/accessible-emoji */
import './App.scss';
import React, { useState } from 'react';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const findCategory =
    categoriesFromServer.find(category => category.id === product.categoryId) ||
    null;
  const findUser =
    findCategory !== null
      ? usersFromServer.find(user => user.id === findCategory.ownerId) || null
      : null;

  return { ...product, category: findCategory, user: findUser };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const visibleProducts = products
    .filter(p => (selectedUser ? p.user?.id === selectedUser : true))
    .filter(p => {
      return selectedCategory ? p.category?.id === selectedCategory : true;
    })
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUser === null ? 'is-active' : ''}
                onClick={() => setSelectedUser(null)}
              >
                All
              </a>

              {usersFromServer.map(value => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={value.id}
                  className={selectedUser === value.id ? 'is-active' : ''}
                  onClick={() => setSelectedUser(value.id)}
                >
                  {value.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </a>
              {categoriesFromServer.map(value => (
                <a
                  key={value.id}
                  data-cy="Category"
                  className={
                    selectedCategory === value.id
                      ? 'button mr-2 my-1 is-info'
                      : 'button mr-2 my-1'
                  }
                  href="#/"
                  onClick={() => setSelectedCategory(value.id)}
                >
                  {value.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSelectedUser(null);
                  setQuery('');
                  setSelectedCategory(null);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(value => (
                  <tr data-cy="Product" key={value.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {value.id}
                    </td>

                    <td data-cy="ProductName">{value.name}</td>
                    <td data-cy="ProductCategory">
                      {value.category.icon}-{value.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        value.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {value.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
