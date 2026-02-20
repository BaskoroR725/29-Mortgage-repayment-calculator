# Frontend Mentor - Time Tracking Dashboard Solution

This is a solution to the [Time tracking dashboard challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/time-tracking-dashboard-UIQ7167Jw). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the site depending on their device's screen size
- See hover states for all interactive elements on the page
- Switch between viewing Daily, Weekly, and Monthly stats

### Screenshot

|        Desktop Version         |        Mobile Version         |         Active States         |
| :----------------------------: | :---------------------------: | :---------------------------: |
| ![](./screenshots/desktop.png) | ![](./screenshots/mobile.png) | ![](./screenshots/active.png) |

### Links

- Solution URL: [https://github.com/BaskoroR725/11-time-tracking-js-fetch.git](https://github.com/BaskoroR725/11-time-tracking-js-fetch.git)
- Live Site URL: [https://baskoror725.github.io/11-time-tracking-js-fetch/](https://baskoror725.github.io/11-time-tracking-js-fetch/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- SASS/SCSS
- Mobile-first workflow
- Vanilla JavaScript

### What I learned

This project was a great exercise in managing State and Data Fetching using Vanilla JavaScript. I focused on writing clean, reusable code.

One of the key technical challenges was ensuring the Profile Card spanned two rows in a CSS Grid while maintaining responsiveness.

```javascript
async function loadData() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) throw new Error("Fail to fetch data.json");
    dashboardData = await response.json();
    updateUI("weekly");
  } catch (error) {
    console.error("Error:", error);
  }
}
```

```scss
.stats-card__current {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
}
```

## Author

- Baskoro Ramadhan
