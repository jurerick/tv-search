import { LitElement, html, css } from 'lit';
import { router } from 'lit-element-router';
import TVMazeClient from "./TVMazeClient";
import  './AppLink';
import './AppMain';

export class TvSearchApp extends router(LitElement) {

  static get properties() {
    return {
      route: { type: String },
      params: { type: Object },
      query: { type: Object },
      title: { type: String },
      shows: { type: [] },
      showDetail: { type: Object }
    };
  }

  static get routes() {
    return [{
      name: 'home',
      pattern: ''
    }, {
      name: 'tv-show',
      pattern: 'tv-show/:id'
    }, {
      name: 'not-found',
      pattern: '*'
    }];
  }

  constructor() {
    super();
    this.route = '';
    this.params = {};
    this.query = {};
    this.title = 'TV Search';
    this.shows = [];
    this.showDetail = null;
  }

  router(route, params, query, data) {
    this.route = route;
    this.params = params;
    this.query = query;
    this.data = data;

    if(route == "tv-show" && params.id != null) {
      this.getShowDetail(params.id);
    }
  }

  render() {

    const parser = new DOMParser();

    const showsElement = (this.route == 'home' && this.shows.length > 0) ? this.shows.map(result => {

      const showDescription = parser.parseFromString(result.show.summary, 'text/html')
        .getElementsByTagName("p").item(0)?.textContent.slice(0, 150);

      return html`
        <div class="show-item">
          <div class="left-col">
            <img class="show-image" src="${result.show.image?.medium}" />
          </div>
          <div class="right-col">
            <div class="show-title">${result.show.name}</div>
            <div class="show-rating">${result.show.rating.average}</div>
            <div class="show-description">
              ${showDescription}... 
              <app-link href="/tv-show/${result.show.id}" class="read-more">Read more</app-link>
            </div>
          </div>
        </div>
      `;
    }) : [];

    
    const showDetailElement = (this.showDetail != null) ? this.parseShowDetail(this.showDetail) : {};

    return html`
      <main>
        <h1>${this.title}</h1>

        <app-main active-route=${this.route}>
          <div route="home">
            <input type="text" @keypress="${this.search}" class="search-input" placeholder="Search TV shows" />
            <div class="app-tv-shows">
                ${showsElement}
            </div>
          </div>
          <div route="tv-show">
            <div class="back-to-home"><app-link href="/">Back to Home</app-linka></div>
            <div class="app-tv-show-detail">
              ${showDetailElement}
            </div>
          </div>
          <div route="not-found">

          </div>
        </app-main>

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

  parseShowDetail(data) {

      const parser = new DOMParser();

      const genres = (this.showDetail.genres.length) ? this.showDetail.genres.map((item) => {
       return html`
          <span class="genre-item">${item}</span>
        `;
      }): [];


      return html`
        <div>
          <div class="left-col">
            <img src=${this.showDetail.image?.original} />
          </div>
          <div class="right-col">
            
            <h1 class="show-name">${this.showDetail.name}</h1>

            <div class="genres">${genres}</div>

            <div class="show-description">
              ${parser.parseFromString(this.showDetail.summary, 'text/html')
                .getElementsByTagName("p").item(0)?.textContent}
            </div>

            <div class="other-details">
              <div>
                <label>Website</label>
                <div>
                  <a href="${this.showDetail.officialSite}" target="_blank">${this.showDetail.officialSite}</a>
                </div>
              </div>
              <div>
                <label>Premiered</label>
                <div>${this.showDetail.premiered}</div>
              </div>                
              <div>
                <label>Rating</label>
                <div>${this.showDetail.rating?.average}</div>
              </div>                
              <div>
                <label>Status</label>
                <div>${this.showDetail.status}</div>
              </div>                
              <div>
                <label>Language</label>
                <div>${this.showDetail.language}</div>
              </div>  
            </div>
          </div>
        </div>
      `;
  }

  async getShowDetail(id) {
    this.showDetail = await TVMazeClient.getShow(id);
  }

  async search(e) {
    if(e.keyCode === 13 && e.key === "Enter") {
      this.shows = await TVMazeClient.searchShows(e.currentTarget.value);
    }
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

      .app-tv-show-detail > div {
        display: flex;
      }

      .app-tv-show-detail h1 {
        margin: 0;
      }

      .app-tv-show-detail .other-details {
        font-size: 14px;
      }
      .app-tv-show-detail .other-details > div {
        margin-bottom: 1em;
      }
      .app-tv-show-detail .other-details > div > label {
        font-weight: bold;
      }

      .app-tv-show-detail .genres{ 
        margin: .5em 0;
      }

      .app-tv-show-detail .genre-item  {
        background: #efd;
        font-size: .9em;
        padding: 0.2em 0.4em;
        border-radius: 0.4em;
        margin-right: 0.4em;
        color: #333;
      }

      .app-tv-show-detail .left-col {
        width: 50%;
      }
      
      .app-tv-show-detail .left-col img{ width: 100% }

      .app-tv-show-detail .right-col {
        padding: 0 1em;
        text-align: left;
        width: 50%;
      }

      .app-tv-show-detail .show-description {
        line-height: 1.6em;
        margin: 1em 0;
      }

      .app-tv-shows {
        display: flex;
        flex-wrap: wrap;
      }

      .app-tv-shows .show-item:hover { 
        box-shadow: 5px 10px #333;
      }

      .app-tv-shows .show-item{
        width: 30%;
        margin: .5em;
        box-sizing: border-box;
        border: 1px solid #333;
        display: flex;
      }

      .app-tv-shows .show-item .left-col {
        width: 45%;
      }

      .app-tv-shows .show-item .right-col {
        text-align: left;
        margin: 0.5em 0.5em 1em 1em;
        width: 50%;
      }

      .app-tv-shows .show-item .show-image {
        width: 100%;
      }

      .app-tv-shows .show-item .read-more {
        font-weight: bold;
        font-style: oblique;
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

      .back-to-home {
        margin: 1em;
      }

      @media (max-width: 575.98px) { 
        main {
          width: 100%;
          margin: 2em 5em;
        }

        .app-tv-shows .show-item{
          width: 100%;
        }

        .app-tv-show-detail > div {
          display: block;
        }
        .app-tv-show-detail .left-col {
          width: 100%;
        }
        .app-tv-show-detail .right-col {
          width: 90%;
          padding: 1em;
        }
      }
    `;
  }
}
