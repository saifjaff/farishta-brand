# Farishta — soft animated companion

This version preserves the selected smooth, luminous mint-and-gold artwork. It uses 16 generated poses across three actual frame sequences, with no pixel-art styling, CSS spinning of a still image, or crossfades between static emotes.

- `flutter`: six wing-flap and eye-expression poses.
- `greeting`: four wing-wave and wink poses.
- `spin`: six poses through front, right three-quarter, rear, back, rear-left and left three-quarter views.

Open `index.html` to compare the motions, pause playback or adjust speed. Tap the main companion to play a greeting once, then return to the flutter loop.

`motion-preview.gif` shows all three animations side by side. The individual GIF previews have a mint background. The animated WebP files and individual PNG/WebP frames preserve transparency.

## Website integration

Keep the script and frames folder together:

```html
<script src="/farishta-soft-companion/companion.js" defer></script>
<farishta-soft id="farishta" state="flutter"
  style="--farishta-size:180px"></farishta-soft>
```

After the script is loaded:

```js
document.querySelector('#farishta').play('spin', {once:true});
```

Other states: `flutter`, `greeting`. Set the `paused` attribute to pause; remove it to resume. Set `speed` between 0.25 and 2. The component starts paused when the user has reduced motion enabled, pauses time while the document is hidden, and preloads frames before playback.

For simple display, use `flutter.webp`, `greeting.webp` or `spin.webp` in an ordinary image element. Those animated image files loop independently; use the component for pause controls and reduced-motion support.

These are short animation studies. Some generated poses vary subtly in ornament detail and body size; more frames and tighter registration could refine the movement further. The main player has syntax/timing checks, while interactive browser playback could not be tested in this session. GIF/WebP frame counts, durations, transparency and unique frames were checked directly.

Original visual generation used the built-in image tool. Visual subagents generated the flutter, greeting and turn strips; the parent extracted original generated pixels with a shared scale per sequence and encoded previews. No visual frames were mirrored or drawn in code. Prompts and source provenance are included. The live website has not been changed.
