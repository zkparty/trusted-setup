import React from 'react'
import { createRoot } from 'react-dom/client';

import './index.css'
import App from "./app/App";
import queryString from 'query-string';

const qsProj: string | (string | null)[] | null = queryString.parse(window.location.search).project;
const project: string | null = (qsProj == null) ? '' : typeof qsProj === 'string' ? qsProj : qsProj[0];

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
      <App project={project}/>
    </React.StrictMode>
  );
