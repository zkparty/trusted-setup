import React from 'react'
import * as ReactDOM from "react-dom";

import './index.css'
import App from "./app/App";
import queryString from 'query-string';

const qsProj: string | (string | null)[] | null = queryString.parse(window.location.search).project;
const project: string | null = (qsProj == null) ? '' : typeof qsProj === 'string' ? qsProj : qsProj[0];

ReactDOM.render(
    <React.StrictMode>
      <App project={project}/>
    </React.StrictMode>,
    document.getElementById('root')
  );
