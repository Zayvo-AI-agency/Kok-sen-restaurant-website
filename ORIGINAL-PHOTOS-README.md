# Kok Sen — client photo update

This project uses the client's supplied menu photographs for 51 existing menu items, the matching signature cards, the food hero and the corresponding gallery entries.

## Review the photos

1. Extract the project ZIP.
2. Open `PHOTO-REVIEW.html` in a browser. It works directly from the extracted folder and shows all 100 supplied photos.
3. Green labels identify assigned menu codes. Amber labels identify photos that need confirmation or have no matching item in the current website menu.
4. Use the original filenames shown in that review when confirming a dish.

`PHOTO-MAPPING.json` records each source filename, its SHA-256 checksum, the web asset and its assigned menu code. `src/data/clientMenuPhotos.ts` is the central mapping used by the website. The client photo assets are in `src/assets/client-menu/`.

The images are web copies of the supplied photographs, with proportional resizing and WebP encoding. Empty transparent margins are trimmed so the whole dish fills its image area; visible photo content is preserved. No food, garnish, plate, scene or background has been generated, replaced, retouched or recoloured.

## Items still needing confirmation

- `chicken/Untitled-4.png`: confirm whether this is CH1 Har Cheong Gai.
- `hor fun/3CSVicEc.png`: confirm whether this is H3 Beef Hor Fun with Black Bean Sauce.
- `hor fun/BackgroundEraser_20260905_134052635.png`: confirm whether this is H4 San Lou Hor Fun.
- Other unclear pork, rice and egg filenames have specific questions in `PHOTO-REVIEW.html`.
- Several supplied photos, including crab, frog, soup and yam paste, do not have a corresponding entry in the current website menu. They are retained for later use; no menu names or prices have been invented for them.

CH1, H3 and R7 previously had generated food images. Those unconfirmed food images have been removed. CH1 uses a neutral menu-code icon in the signature cards; the full menu supports text-only rows until a photo is confirmed.

The supplied menu ZIP contains no restaurant, storefront, interior, street or chef/wok photos. Existing images for those scenes remain from the website project and are not verified client originals. Supply the actual photos to replace them next.

## Continue editing in Google AI Studio

Use this instruction when requesting further edits:

> Use the existing client photo files in `src/assets/client-menu/` and the mappings in `src/data/clientMenuPhotos.ts`. Do not generate, redraw or substitute food photos. Preserve the supplied dishes and plating. If a matching original is not confirmed, keep the menu item without a photograph and ask which source file to use. Do not infer a recipe, allergen, price or preparation from an image.

## Run and build

```sh
npm ci
npm run dev
npm run build
```

The `esbuild` development dependency was updated from `^0.25.0` to `^0.28.2` to satisfy Vite 8's peer requirement. A lockfile is included for reproducible installation.

## Hosting context

The project has a React/Vite frontend and an Express server in `server.ts`. The dining concierge calls `/api/concierge` and uses a server-side `GEMINI_API_KEY`. Reservation and order flows construct WhatsApp links. Keeping the concierge functional therefore requires a compatible backend or a separate backend deployment; uploading only frontend files to a static hosting folder will not provide that endpoint. Hosting has not been changed by this photo update.

See `VALIDATION.md` for the checks completed on this version.
