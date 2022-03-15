import React from 'react';

import type { IStartMenuTabShortcutDesc } from '../../base/extensions';
import type { IStartMenuTabWrapperProps } from '../interfaces';

interface IStartMenuTabShortcutsProps extends Omit<IStartMenuTabWrapperProps, 'mode' | 'activeTab'> {
  /**
   * List of shortcut desc
   */
  shortcuts: IStartMenuTabShortcutDesc[];

  /**
   * Updates the highlight value in the `AppContext`
   */
  setHighlight: React.Dispatch<React.SetStateAction<boolean>>;
}

export function StartMenuTabShortcuts({ tabs, shortcuts, setActiveTab, setHighlight, status }: IStartMenuTabShortcutsProps) {
  const onClick = (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>, shortcut: IStartMenuTabShortcutDesc) => {
    evt.preventDefault();
    setActiveTab(tabs.find((t) => t.desc.id === shortcut.tabId));
    if (shortcut.setHighlight) {
      setHighlight(true); // the value is set to `false` when the animation in `CommonSessionCard` ends
    }
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {status === 'success' &&
        shortcuts.map((s) => {
          return (
            <li key={s.id} className="nav-item">
              <a className="nav-link" role="button" onClick={(evt) => onClick(evt, s)}>
                {' '}
                {s.icon ? <i className={`me-2 ${s.icon}`} /> : null}
                {s.text}
              </a>
            </li>
          );
        })}
    </>
  );
}
