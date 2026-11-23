# Farishta — continuous layered motion

This is a new approach to the choppy generated-frame animations. It keeps one stable body/face image and moves separate wing artwork continuously around fixed attachment points. It uses ordinary browser transforms with smooth easing, rather than swapping between inconsistent full-character poses.

Open `index.html` for a continuous flutter, tap-to-wave, happy bounce, pause control and wing-speed control. Reduced-motion preferences are respected.

`assets/body.png` and `assets/wing.png` are original transparent generated layer artwork; WebP versions are provided for the player. The right wing pair mirrors the left wing pair. The body and face remain unchanged throughout playback. The website itself does not depend on a generated-frame sprite sheet.

`smooth-hover.gif` and `smooth-hover.webp` are rendered examples on a pale mint background. They contain 90 samples of the continuous rig, at 25 frames per second for 3.6 seconds. The browser player runs continuously at the display’s animation rate. The loop uses a common 3.6-second period for hover and wing motion, so it closes cleanly.

The motion-interpolation experiment on the earlier whole-character frames produced ghosting and was rejected. This package intentionally focuses on the motions suited to a 2D rig. It does not claim to provide a full 3D body turn. A convincing full turn would need a consistent 3D model or a properly matched set of turn drawings.

Layer images were edited with the built-in image generation tool using the selected soft mint-and-gold companion as reference. Pixel art was not used. The source images are recorded in `validation.json`. Rendering moves existing layer pixels and does not generate a new face or body for each pose.

The animation file structure, unique frames, loop durations and JavaScript syntax were checked. Interactive browser playback remains untested because local preview access was blocked in this session. Nothing has been deployed or installed on the live website.
