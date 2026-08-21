# Replugged Collective 🔌

> Your monthly excuse to log off.

RPC is a monthly hobby subscription. A box turns up, you put the phone in the other
room, and you make something with your hands: pottery, painting, music, fitness,
whatever's next in the rotation.

This repo is the website for it. Plain HTML, CSS and JavaScript, built from scratch.
No frameworks, no build step, no npm install.

**Live:** https://lalitsh03.github.io/replugged-collective/

## What's in here

```
index.html    the landing page
signup.html   the Join RPC form
styles.css    all the styling
script.js     carousel, form, counters, small effects
images/       logo, banner, activity photos
```

## Adding a new activity

Two steps: add the photo, add the card.

**1. Drop the photo into `images/`.** Name it `activity-<something>.jpg`, all
lowercase. Landscape works best. The card slot is 4:3 and crops from the centre,
so tall phone photos lose their top and bottom. Keep files under about 300 KB or
the page gets slow on phones.

**2. Copy an existing card in `index.html`.** Find the block inside
`<div class="carousel-track">` and paste another one, changing three things:

```html
<article class="activity-card">
  <div class="activity-media">
    <img class="activity-photo" src="images/activity-kayaking.jpg" loading="lazy"
         alt="Kayaks lined up on a lake shore">
    <span class="activity-media-note">Add image:<br><code>activity-kayaking.jpg</code></span>
  </div>
  <h3>Kayaking</h3>
  <p>One sentence on what's in the box and why it's worth a Saturday.</p>
</article>
```

Change the `src`, the `<code>` filename to match, the `alt` text, the `<h3>` title
and the description. That's it. The carousel picks up the new card automatically,
counts it, and adds a dot for it. No JavaScript to touch.

**If the photo isn't there yet,** the card shows a hatched placeholder printing the
exact filename it's waiting for. Drop that file in later and the card fills itself
in. Pottery and jet skiing have real photos; the other five are still waiting.

**One spare photo is in the repo** but not on a card yet: `activity-kayaking.jpg`.
Use the snippet above to add it whenever you want.

### If the subject sits off-centre

Slots crop from the middle, which is unkind to tall phone photos where the subject
sits near the bottom. Add an `object-position` to that one image to slide the crop:

```html
<img class="activity-photo" src="images/activity-jetskiing.jpg"
     style="object-position: center 69%" ...>
```

`50%` is the default middle and higher numbers move the visible window down. The
jet skiing card uses `69%` so the skis land in frame rather than being cut off at
the bottom, and so the black letterbox bars baked into the screenshot stay out of
shot.

## Social links

All five are live and open in a new tab:

| Platform | URL |
|---|---|
| Facebook | https://www.facebook.com/profile.php?id=61593046847820 |
| TikTok | https://www.tiktok.com/@repluggedcollecti |
| Reddit | https://www.reddit.com/r/RepluggedCollective/ |
| Instagram | https://www.instagram.com/repluggedcollective/ |
| X | https://x.com/RepluggedCo |

They appear in **two rows**, one in the hero and one near the bottom of
`index.html`, so any URL change has to be made in both places. Search for
`social-link` to find them.

Each icon carries its own brand colour. Instagram uses a gradient defined once in
the hidden `<svg>` at the top of `index.html`, which is why its `fill` is
`url(#ig-gradient)` rather than `currentColor`.

## Counting how many people sign up

Add `?stats` to the signup URL:

```
https://lalitsh03.github.io/replugged-collective/signup.html?stats
```

You get page opens, details entered, and a conversion rate. Out of the box **these
count your own browser only**, because they live in `localStorage`.

### Getting real numbers

To count everyone, you need something outside GitHub Pages, because static hosting
serves files but can't receive them. The setup takes about two minutes:

1. Sign up at [goatcounter.com/signup](https://www.goatcounter.com/signup). The
   "code" you choose becomes your subdomain, so `replugged` gives you a dashboard
   at `replugged.goatcounter.com`. Free for normal traffic, no cookies, and no
   GDPR banner needed.
2. Open `script.js`, find the `COUNTER` block near the top of the counters
   section, and set `goatCounterCode: 'replugged'`.
3. Commit and push, wait a minute or two for Pages to rebuild.

Page opens then show under **Pages** in the dashboard, and completed signups show
under **Events** as `signup-completed`. That second number is your signup count.

Nothing is added to the page markup: the code requests GoatCounter's 1x1 GIF
directly, so no third-party JavaScript ever runs on the site. Note that ad
blockers will stop some of these requests, so treat the number as a solid floor
rather than an exact count.

**It only ever sends a tally.** The name, email and hobby are read off the form,
shown back on screen, and dropped. They are never included in what goes out. That
is why this can stay switched on without breaking the promise made to visitors.

If you would rather use your own backend, set `endpoint` in the same block instead.
It receives `{event, at}` and nothing else.

If you want the actual email addresses rather than just a count, that's a different
job: use Formspree, FormSubmit or a Google Form, and see the section below.

### The wording takes care of itself

The privacy lines on both pages are driven by whether counting is switched on. With
it off they say nothing is transmitted; with it on they say only the signup is
counted. Search for `data-note-local` to see both versions. This exists so the site
can't end up promising one thing while doing another.

## The signup form

`signup.html` validates properly but doesn't transmit anything, for the same
reason as above. On submit it shows what it captured and says plainly that nothing
was sent. To make it real, give the `<form>` an `action` and `method` pointing at
your endpoint and delete the submit handler in `script.js`.

The hobby field is a free-text input backed by a list of 61 suggestions. It shows
five at a time and scrolls for the rest. Visitors can type to search it, arrow
through it, or ignore it entirely and write in anything.

To change the suggestions, edit the `<datalist id="hobby-options">` block in
`signup.html`. That list is the single source of truth: `script.js` reads it and
builds the scrollable dropdown from it, and if the script never runs the browser's
own datalist takes over. To show a different number of rows, change the `5` in the
`max-height` on `.combo-list` in `styles.css`.

## Editing anything else

- Copy, headings, activity names: `index.html`
- Colours, spacing, layout: `styles.css` (design tokens are in `:root` at the top)
- Carousel timing, form validation, counters: `script.js`

---

Early concept, not an actual subscription service. Please don't send us money yet.
