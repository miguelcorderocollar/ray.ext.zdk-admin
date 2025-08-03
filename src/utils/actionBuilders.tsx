import { Action, Keyboard } from "@raycast/api";

/**
 * Creates standard "Open in Browser" and "Copy Link" actions for a given URL
 */
export const createOpenAndCopyActions = (url: string, title: string) => (
  <>
    <Action.OpenInBrowser key="open" title={title} url={url} shortcut={Keyboard.Shortcut.Common.Open} />
    <Action.CopyToClipboard key="copy" title={`Copy ${title}`} content={url} shortcut={Keyboard.Shortcut.Common.Copy} />
  </>
);

/**
 * Creates a "Copy to Clipboard" action for content
 */
export const createCopyAction = (content: string, title: string, shortcut?: Keyboard.Shortcut) => (
  <Action.CopyToClipboard
    key="copy-content"
    title={title}
    content={content}
    shortcut={shortcut || Keyboard.Shortcut.Common.Copy}
  />
);

/**
 * Creates a "Copy to Clipboard" action with custom shortcut
 */
export const createCopyActionWithShortcut = (content: string, title: string, shortcut: Keyboard.Shortcut) => (
  <Action.CopyToClipboard key="copy-custom" title={title} content={content} shortcut={shortcut} />
);

/**
 * Creates an "Open in Browser" action
 */
export const createOpenAction = (url: string, title: string, shortcut?: Keyboard.Shortcut) => (
  <Action.OpenInBrowser
    key="open-browser"
    title={title}
    url={url}
    shortcut={shortcut || Keyboard.Shortcut.Common.Open}
  />
);

/**
 * Creates an "Open in Browser" action with custom shortcut
 */
export const createOpenActionWithShortcut = (url: string, title: string, shortcut: Keyboard.Shortcut) => (
  <Action.OpenInBrowser key="open-custom" title={title} url={url} shortcut={shortcut} />
);
