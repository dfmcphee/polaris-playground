import React from 'react';
import {Link} from 'react-router-dom';

export default function Prototype({prototype}) {
  return (
    <Link to={`/prototype/${prototype.id}`}>
      {prototype.description}
    </Link>
  );
}
