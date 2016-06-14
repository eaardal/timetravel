import React, { PropTypes } from 'react';

const NavList = ({ links }) => (
  <ul className="nav-list">
    {
      links.map((link) =>
        (
          <li className="nav-list__item" key={link.title}>
            <a className="nav-list__item-link" href={link.href}>
              {link.title}
              <i className="nav-list__item-icon icon icon-chevron-right"></i>
            </a>
          </li>
        )
      )
    }
  </ul>
);

NavList.propTypes = {
  links: PropTypes.array.isRequired,
};

export default NavList;
