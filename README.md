# Nexus Arena E-Sports Club

Nexus Arena is a complete eight-page, mobile-responsive university E-Sports Club website created for the UCCD2323 Front-End Web Development group assignment (June 2026). It uses only HTML5, CSS3, JavaScript, jQuery and Bootstrap as required by the brief.

## Project structure

```text
esports-club/
├── index.html              Home and featured competitions
├── about.html              Club story, values, activities and committee
├── tournaments.html        Filterable current and upcoming tournaments
├── schedule.html           Event timetable and live campus forecast
├── teams.html              Four club team profiles
├── rankings.html           Team standings and ranking method
├── players.html            Interactive student player profiles
├── contact.html            Membership form, contact details, FAQ and social plugin
├── css/
│   └── style.css           Shared responsive styles and animations
├── js/
│   ├── main.js             Shared navigation/footer, filters, forms and UI behaviour
│   ├── storage.js          Cookie, localStorage and sessionStorage demonstrations
│   └── api.js              jQuery AJAX request and live weather rendering
└── images/
    ├── favicon.svg         Original lightweight browser icon
    ├── arena-hero.png      Full-resolution original hero artwork
    ├── arena-hero-1440.webp
    └── arena-hero-768.webp Responsive, compressed hero variants
```

## Webpages

1. `index.html` - Hero, club statistics, featured tournaments, activities and calls to action.
2. `about.html` - Original club background, mission, values, weekly activities and student committee.
3. `tournaments.html` - Six tournament cards with game filters, registration status and favourite buttons.
4. `schedule.html` - August event timeline, weekly timetable and live campus forecast.
5. `teams.html` - Four competitive divisions with records, captains, training times and favourite buttons.
6. `rankings.html` - Responsive standings table, recent form and transparent points methodology.
7. `players.html` - Eight keyboard-accessible profiles opening in a Bootstrap modal.
8. `contact.html` - Validated membership form, visit information, FAQ and social sharing integration.

For a four-member group, two pages can be assigned to each member. Replace this suggested allocation with the actual contribution record:

| Member | Suggested pages |
|---|---|
| Member 1 | `index.html`, `about.html` |
| Member 2 | `tournaments.html`, `schedule.html` |
| Member 3 | `teams.html`, `rankings.html` |
| Member 4 | `players.html`, `contact.html` |

## Required technologies

### Cookies

Implemented in `js/storage.js`. The cookie-consent banner appears until the visitor chooses **Accept** or **Essential only**. The decision is saved in the `nexus_cookie_consent` cookie for 180 days with `SameSite=Lax`. No tracking cookie is created.

Presentation demo: clear the `nexus_cookie_consent` cookie in browser developer tools, reload the page, make a choice and show the cookie value.

### localStorage

Implemented in `js/storage.js`. Star buttons on the Home, Tournaments and Teams pages save IDs in the `nexus_favourites` localStorage item as a JSON array. The filled-star state and navigation count remain after closing and reopening the browser.

Presentation demo: favourite a tournament or team, inspect `nexus_favourites`, close/reopen the browser and show that the star remains selected.

### sessionStorage

Implemented in `js/storage.js` and used by `js/main.js` in two meaningful ways:

- `nexus_tournament_filter` remembers the selected tournament filter only for the current browser-tab session.
- `nexus_recent_player` remembers the last player profile viewed and displays it at the top of `players.html` during the current session.
- The validated membership form also stores `nexus_join_interest` for the current session as a small extra demonstration.

Presentation demo: choose a tournament filter or open a player, navigate away and back in the same tab, then close the tab and open a new one to show that the session value is gone.

### jQuery

jQuery 3.7.1 is loaded from its official CDN on every page. It is used for DOM construction, event handling, fade animations, tournament filtering, storage UI updates, form feedback and the REST API request.

### RESTful API with jQuery

Implemented in `js/api.js` and displayed on `schedule.html` under **Campus forecast**.

The site sends a real `$.ajax()` GET request to the [Open-Meteo Forecast API](https://open-meteo.com/en/docs) for the UTAR Kampar area. Open-Meteo was selected because it is logically useful for travel to in-person club events, supports browser CORS requests, returns JSON, requires no secret API key and permits free non-commercial use with attribution. The widget displays current temperature, wind and a three-day forecast. If the request fails, the page shows an honest error state and does not substitute fake weather.

Internet access is required for the live API, jQuery/Bootstrap assets, fonts and the social widget. The website content and hero image remain local.

### Social media plugin

The official X share-button widget is visible in the Home call-to-action and in the **Share the club** card on `contact.html`. It loads with `https://platform.twitter.com/widgets.js`, requires no API key and lets visitors share the club. Discord, Instagram and YouTube links are also included as normal social links; replace their destinations with real club profiles before deployment.

## Responsive and accessibility features

- Bootstrap mobile hamburger navigation with an active-page indicator.
- Responsive grid layouts, horizontally scrollable ranking/schedule tables and mobile-specific spacing.
- Responsive `<picture>` hero using 768 px and 1440 px WebP variants.
- Skip link, semantic landmarks, descriptive image alternative text, form labels, keyboard-accessible player cards and ARIA states.
- Hover and reveal animations with a `prefers-reduced-motion` fallback.
- Shared design tokens, typography and focus styles across all pages.

## How to run

The site works best through a local web server because browsers apply stricter rules to some features opened with `file://`.

### Python

```bash
cd esports-club
python -m http.server 8000
```

Open `http://localhost:8000/index.html`.

### Visual Studio Code Live Server

Open the `esports-club` folder, right-click `index.html`, select **Open with Live Server**, and use the displayed local address.

No build step, package installation, database, API key or login is required.

## Testing checklist completed

- All eight HTML files exist and are linked from the shared navigation.
- Internal links and local image/script/stylesheet references resolve.
- JavaScript files pass syntax checking.
- Each page has one unique document title and no duplicate IDs.
- The active navigation state is calculated from the current filename.
- The Bootstrap hamburger menu collapses after a mobile navigation selection.
- Forms use HTML5 validation and do not claim to transmit data in this prototype.
- The live API has loading, success and error states.
- The layout was checked at desktop and mobile viewport sizes.

## Original content and asset note

All club names, teams, players, records and event details are fictional, original sample content for this assignment. The arena hero artwork was generated specifically for this project with the built-in OpenAI image-generation tool using this final prompt:

> Original cinematic university esports arena with four diverse student competitors at gaming stations, wide composition with dark negative space for page copy, polished stylized 3D realism, navy/cyan/coral lighting, and no text, logos, trademarks, watermarks, violence or copyrighted characters.

Open-Meteo data attribution is shown directly below the live forecast widget. Bootstrap, Bootstrap Icons, jQuery, Google Fonts and the X widget are loaded from their respective public CDNs.
