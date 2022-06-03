import { LitElement, html } from 'lit-element';
import { outlet } from 'lit-element-router';
 
export class AppMain extends outlet(LitElement) {
  render() {
    return html`
      <slot></slot>
    `;
  }
}
 
customElements.define('app-main', AppMain);