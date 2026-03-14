import '../css/blog.css';
import { App } from './app';

const appEl = document.getElementById('app');
if (!appEl) throw new Error('No #app element found');

const app = new App(appEl);
app.init();
