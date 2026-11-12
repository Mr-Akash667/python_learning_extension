
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';
import { Widget } from '@lumino/widgets';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-python-learning:plugin',
  description: 'Python Learning sidebar panel',
  autoStart: true,

  requires: [INotebookTracker],

  activate: (app: JupyterFrontEnd, tracker: INotebookTracker) => {
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

        <h3>Detected Python Error</h3>
        <div id="python-error-output">
          <p>No Python errors detected yet.</p>
        </div>
      </div>
    `;

    app.shell.add(widget, 'left', { rank: 600 });
    app.shell.activateById(widget.id);

    const errorOutput = widget.node.querySelector(
      '#python-error-output'
    ) as HTMLDivElement;

    const connectedNotebooks = new WeakSet<object>();

    const watchNotebook = (panel: Parameters<
      typeof tracker.forEach
    >[0] extends (value: infer T) => void ? T : never) => {
      if (connectedNotebooks.has(panel)) {
        return;
      }

      connectedNotebooks.add(panel);

      panel.sessionContext.iopubMessage.connect((_sender, message) => {
        if (message.header.msg_type !== 'error') {
          return;
        }

        const error = message.content as {
          ename?: string;
          evalue?: string;
        };

        const errorType = error.ename || 'Python Error';
        const errorMessage = error.evalue || 'No error message available';

        errorOutput.innerHTML = '';

        const typeElement = document.createElement('h4');
        typeElement.textContent = errorType;

        const messageElement = document.createElement('p');
        messageElement.textContent = errorMessage;

        errorOutput.appendChild(typeElement);
        errorOutput.appendChild(messageElement);

        console.log('Python error detected:', errorType);
        console.log('Error message:', errorMessage);
      });
    };

    tracker.widgetAdded.connect((_sender, panel) => {
      watchNotebook(panel);
    });

    tracker.forEach(panel => {
      watchNotebook(panel);
    });

    console.log('Python Learning panel added:', widget.id);
  }
};

export default plugin;
