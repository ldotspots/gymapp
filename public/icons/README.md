# PWA Icons

This directory should contain the following icon files for the Progressive Web App:

- `icon-192.png` - 192x192px
- `icon-512.png` - 512x512px

## How to Generate

You can use the provided `icon.svg` as a starting point. Here are some options:

### Option 1: Online Tool
Use [RealFaviconGenerator](https://realfavicongenerator.net/) to upload your SVG and generate all required sizes.

### Option 2: ImageMagick (CLI)
If you have ImageMagick installed:

```bash
# From the gym-app directory
convert public/icons/icon.svg -resize 192x192 public/icons/icon-192.png
convert public/icons/icon.svg -resize 512x512 public/icons/icon-512.png
```

### Option 3: Design Tool
Export the SVG at the required sizes using:
- Figma
- Sketch
- Adobe Illustrator
- Inkscape (free)

## Temporary Solution

For now, the app will work without PNG icons, but you may see warnings in the console. The PWA installation will still function, but without proper icons.

To test locally without icons, you can temporarily comment out the `icons` array in `vite.config.ts`.
