
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { Widget } from '@lumino/widgets';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-python-learning:plugin',
  description: 'Python Learning sidebar panel',
  autoStart: true,

  activate: (app: JupyterFrontEnd) => {
    console.log('PYTHON LEARNING EXTENSION ACTIVATED');

    const widget = new Widget();

    widget.id = 'python-learning-panel';
    widget.title.caption = 'Python Learning';
    widget.title.iconClass = 'jp-PythonLearningIcon';
    widget.title.closable = true;

    widget.node.innerHTML = `
      <div style="padding: 20px;">
        <h2>🎓 Python Learning</h2>
        <p>Welcome to your Python Learning extension!</p>
        <p>Your Python error explanations and quizzes will appear here.</p>
      </div>
    `;

    app.shell.add(widget, 'left', { rank: 600 });
    app.shell.activateById(widget.id);

    console.log('Python Learning panel added:', widget.id);
    console.log('Python Learning panel visible:', widget.isVisible);
  }
};

export default plugin;
