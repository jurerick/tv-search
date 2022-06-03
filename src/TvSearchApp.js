import { LitElement, html, css } from 'lit';
import TVMazeClient from "./TVMazeClient";

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;

export class TvSearchApp extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      shows: []
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        color: #1a2b42;
        margin: 0 auto;
        text-align: center;
        background-color: var(--tv-search-app-background-color);
      }

      main {
        flex-grow: 1;
        margin: 5em;
        width: 1200px;
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }

      .app-tv-shows {
        display: flex;
        flex-wrap: wrap;
      }

      .app-tv-shows > .show-item:hover { 
        box-shadow: 5px 10px #aad; 
        cursor: pointer;
      }

      .app-tv-shows > .show-item {
        width: 30%;
        margin: .5em;
        box-sizing: border-box;
        border: 1px solid #333;
        display: flex;
      }

      .app-tv-shows > .show-item .left-col {
        width: 45%;
      }

      .app-tv-shows > .show-item .right-col {
        text-align: left;
        margin: 0.5em 0.5em 1em 1em;
        width: 50%;
      }

      .app-tv-shows > .show-item .show-image {
        width: 100%;
      }

      .app-tv-shows .show-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: .2em;
      }

      .app-tv-shows .show-rating {
        color: maroon;
        font-weight: bold;
        margin-bottom: .5em;
      }

      .search-input {
        margin: 1em;
        padding: .5em;
        font-size: 18px;
      }
    `;
  }

  constructor() {
    super();
    this.title = 'TV Search';
    this.shows = [];
  }

  async search(e) {
    if(e.keyCode === 13 && e.key === "Enter") {
      this.shows = await TVMazeClient.searchShows(e.currentTarget.value);
    }
  }

  render() {

      const parser = new DOMParser();

      const showsElement = (this.shows.length > 0) ? this.shows.map(result => {

      const showDescription = parser.parseFromString(result.show.summary, 'text/html')
        .getElementsByTagName("p").item(0).textContent.slice(0, 150);

      return html`
        <div class="show-item">
          <div class="left-col">
            <img class="show-image" src="${result.show.image.medium}" />
          </div>
          <div class="right-col">
            <div class="show-title">${result.show.name}</div>
            <div class="show-rating">${result.show.rating.average}</div>
            <div class="show-description">
              ${showDescription}...
            </div>
          </div>
        </div>
      `;
    }) : [];


    return html`
      <main>
        <h1>${this.title}</h1>
        <input type="text" @keypress="${this.search}" class="search-input" placeholder="Search TV shows"  />

        <div class="app-tv-shows">
          ${showsElement}
        </div>
      </main>

      <p class="app-footer">
        Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/jurerick"
          >Jur Erick Porras</a
        >.
      </p>
    `;
  }
}
