# Replugged Collective 🔌

> Your monthly excuse to log off.

RPC is a monthly hobby subscription. A box turns up, you put the phone in the other
room, and you make something with your hands — pottery, painting, music, fitness,
whatever's next in the rotation.

This repo is the website for it. Class project, built from scratch: plain HTML, CSS
and JavaScript. No frameworks, no build step, no npm install.

**Live:** https://lalitsh03.github.io/replugged-collective/

## What's in here

```
index.html    the landing page
signup.html   the Join RPC form
styles.css    all the styling
script.js     the small interactive bits
images/       logo, banner, activity photos
```

## Two things worth knowing

**Adding activity photos.** The six activity cards each look for a file in
`images/` — and until it's there, the card shows you the exact filename it wants
(`activity-fitness.jpg`, `activity-painting.jpg`, and so on). Drop a correctly
named file in and the card fills itself in. No code to touch.

Landscape photos work best, and keep filenames lowercase — GitHub serves this from
Linux, which cares about capital letters even when your laptop doesn't.

**The signup form doesn't actually sign anyone up.** GitHub Pages can serve files
but can't receive them, so there's nowhere for a submission to go. The form checks
what you typed and then says plainly that nothing was sent — better than pretending
it worked and quietly binning real signups. Pointing it at a Google Form or a
Formspree endpoint is a small change to `signup.html` whenever we want it to be real.

---

Built for a class. Not an actual subscription service — please don't send us money.
