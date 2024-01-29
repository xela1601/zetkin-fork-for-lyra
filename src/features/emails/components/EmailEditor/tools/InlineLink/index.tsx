import { API, InlineToolConstructorOptions } from '@editorjs/editorjs';

export default class LinkTool {
  private _api: API;
  private _button: HTMLButtonElement | null;
  private _isLink: boolean;

  addLink(range: Range) {
    const selectedText = range.extractContents();
    const anchor = document.createElement('a');
    anchor.classList.add('inlineLink');

    anchor.appendChild(selectedText);
    range.insertNode(anchor);

    this._api.selection.expandToTag(anchor);
  }

  checkState() {
    const anchor = this._api.selection.findParentTag('A');

    this._isLink = !!anchor;
  }

  constructor({ api }: InlineToolConstructorOptions) {
    this._api = api;
    this._button = null;
    this._isLink = false;
  }

  static get isInline() {
    return true;
  }

  removeLink(range: Range) {
    const anchor = this._api.selection.findParentTag('A');
    const text = range.extractContents();

    anchor?.remove();

    range.insertNode(text);
  }

  render() {
    this._button = document.createElement('button');
    this._button.type = 'button';
    this._button.textContent = 'Link';
    this._button.classList.add(this._api.styles.inlineToolButton);

    return this._button;
  }

  get state() {
    return this._isLink;
  }

  set state(isLink: boolean) {
    this._isLink = isLink;

    this._button?.classList.toggle(
      this._api.styles.inlineToolButtonActive,
      isLink
    );
  }

  surround(range: Range) {
    if (this._isLink) {
      this.removeLink(range);
      return;
    }

    this.addLink(range);
  }

  static toolbox() {
    return {
      title: 'Link',
    };
  }
}
