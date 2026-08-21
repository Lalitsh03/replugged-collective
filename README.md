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
in. That's why the six current cards look the way they do.

**Two photos are already in the repo** but not on any card: `activity-kayaking.jpg`
and `activity-jetskiing.jpg`. Use the snippet above to add them whenever you want.

## Adding real social links

Both social rows (one in the hero, one near the bottom of `index.html`) point at
`href="#"`. Search for `social-link` and replace the `#` with the real URLs. There
are two copies of each icon, so change both.

## Tracking interest

Add `?stats` to the signup URL to see the counters:

```
https://lalitsh03.github.io/replugged-collective/signup.html?stats
```

You get page opens, details entered, and a conversion rate.

**These numbers are from your own browser only.** They live in `localStorage`, so
they count your visits on your device and nobody else's. That is a deliberate
trade: it lets the site honestly tell visitors that nothing they type is
transmitted anywhere.

**To count everyone who visits,** you need something outside GitHub Pages, because
static hosting can serve files but can't receive them. Options, easiest first:

- **GoatCounter or Plausible** for page views. Free tiers, one script tag.
- **Formspree, FormSubmit or a Google Form** for the actual signups, which also
  gets you the email addresses rather than just a count.

Then open `script.js`, find `ANALYTICS_ENDPOINT`, and set it. One important catch:
the moment data starts leaving the browser, the copy on `index.html` and
`signup.html` promising that it doesn't becomes untrue. Change that wording at the
same time. There's a warning comment sitting right above the setting.

## The signup form

`signup.html` validates properly but doesn't transmit anything, for the same
reason as above. On submit it shows what it captured and says plainly that nothing
was sent. To make it real, give the `<form>` an `action` and `method` pointing at
your endpoint and delete the submit handler in `script.js`.

The hobby field is a free-text input backed by a list of 61 suggestions. Visitors
can type to search it or write in anything that isn't on it. To change the
suggestions, edit the `<datalist id="hobby-options">` block.

## Editing anything else

- Copy, headings, activity names: `index.html`
- Colours, spacing, layout: `styles.css` (design tokens are in `:root` at the top)
- Carousel timing, form validation, counters: `script.js`

---

Early concept, not an actual subscription service. Please don't send us money yet.
