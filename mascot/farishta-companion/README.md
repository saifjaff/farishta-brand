# Farishta website companion

Six transparent expressions: happy, greeting, thinking, celebrating, sleepy and sad.

Open `index.html` to try the animated companion and download individual PNGs. The images also have lossless WebP copies for the demo.

The animation uses CSS floating, rocking and celebratory bouncing, with expression changes between generated images. It is not a frame-by-frame wing-flapping animation or a 3D model.

## Add to a website

Keep `companion.js` and `assets/` together, then include:

```html
<script src="/farishta-companion/companion.js" defer></script>
<farishta-companion id="farishta" state="happy"
  style="--farishta-size:160px"></farishta-companion>
```

After the script has loaded:

```js
document.querySelector('#farishta').setState('celebrating');
```

Available states: `happy`, `greeting`, `thinking`, `celebrating`, `sleepy`, `sad`.

Tap or keyboard-activate the companion to greet; it returns to happy after 3.5 seconds. Set `motion="off"` to stop animation. System reduced-motion preferences are respected automatically. Animation pauses when the page is hidden. The `farishta-state` event exposes `event.detail.state`.

Suggested app uses: greeting on entry; thinking during loading; celebrating on shared goal completion. Use sad for a temporary connection issue, not to shame a user for missing worship. All preview messages are examples; no live data or tracking is connected.

Original identity: the mint-and-gold option 1 glow companion selected in this chat. These assets and this prototype have not been installed on the live website.
