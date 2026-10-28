import React from 'react';

import { getProgressStats } from '../utils/taskUtils';

function ProgressBar({ tasks }) {
  const { total, completed, percent } = getProgressStats(tasks);

  return (
    <div className="progress-indicator">
      <div className="progress-summary">
        <span>
          {completed} of {total} task{total === 1 ? '' : 's'} complete
        </span>
        <span className="progress-percent">{percent}%</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
