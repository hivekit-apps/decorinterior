# OWNER INPUT QUEUE — Decor Interior Kiril Fixes Cycle

**Written:** 2026-10-22T03:40Z
**Site:** https://decorinterior.ca (prod) · preview `dpl_CMXcv6ZQ27omsCwC3zQh9vbX1CCM`
**Session:** contractor-sites sub-root, ITEM_B of 4-site queue
**Scope:** this file carries decisions the owner must make BEFORE the Kiril-fix preview is prod-promoted. Preview itself ships; prod-promote blocks on these items.

---

## 1. Image–service pairing mismatches (Kiril feedback — F-CT-15 + LB-CS-15)

Audit methodology: vision-LLM swap-test on each of 15 service hero images. Confirmed Kiril's basement-coating defect + surfaced 1 additional HIGH + 2 LOW.

### HIGH — fix before next prod-promote

| slug | current image | problem | recommended action |
|---|---|---|---|
| `basement-floor-coating` | `/photos/basement-floor-coating.jpg` | Shows a finished basement rec room with leather chairs + TV console; floor is secondary. Swap-test with `residential-epoxy-flooring` fails — a reader cannot distinguish. **Kiril's explicit flag.** | Owner either (a) provides a real work-photo where a BASEMENT FLOOR COATING APPLICATION dominates the frame (e.g., half-coated/half-raw concrete; plain-coat solid grey/tan with visible basement context like utility walls); OR (b) authorizes imagen-pipeline regeneration with the above prompt. |
| `interior-concrete-resurfacing` | `/photos/interior-concrete-resurfacing.jpg` | Empty industrial loft with polished-grey concrete floor. No visible evidence of RESURFACING (vs original). Swap-test with `polished-concrete-floors` fails. | Owner either (a) provides a real resurfacing work-photo (before/after half-split preferred; or a floor where the micro-topping / overlay character is clearly readable); OR (b) authorizes imagen-pipeline regeneration. |

### LOW — ship-acceptable; improve if budget allows

| slug | current image | note |
|---|---|---|
| `decorative-concrete-overlays` | `/photos/decorative-concrete-overlays.jpg` | Overlay subject underweight (~45%); overlay character not strongly readable. Consider a stamped/scored/color-contrast overlay close-up. |
| `decorative-concrete-features` | `/photos/decorative-concrete-features.jpg` | Kitchen staging competes with the concrete feature (island + fireplace). Consider isolating one feature in frame. |

### PASS — 11/15 image pairings verified

residential-epoxy-flooring · commercial-epoxy-flooring · polished-concrete-floors · concrete-staining · interior-stucco-accent-walls · decorative-wall-finishes · architectural-wall-designs · venetian-plaster · concrete-designs-on-walls · decorative-interior-floor-coatings · microcement

**Pattern note (F-CT-15 non-degeneracy):** The 2 HIGH + 2 LOW defects ALL fall in the overlapping "polished concrete / resurfacing / overlay / coating" territory. The image-pool apparently drew from similar "modern grey concrete floor in a staged room" prompts. The visual distinctions BETWEEN these services (stain vs overlay vs resurface vs coating) are not sufficiently non-degenerate in the hero set. Fixing the 2 HIGH defects also addresses the pattern.

---

## 2. Email identity change (Kiril feedback)

**Current state (`config/site.json` → `business.email`):**
```
"email": "info@decorcoatings.ca"
```
This routes contact-form submissions + visible contact-page email to a Decor-Coatings-branded address. Kiril flagged: should be Decor-Interior-branded + Onder should have access.

**Options for owner:**

1. **`info@decorinterior.ca`** (preferred — matches domain)
   - Requires: DNS MX record on decorinterior.ca → Resend (or Google Workspace, or ImprovMX forwarding)
   - Requires: Resend domain verification (TXT + MX records added to the decorinterior.ca DNS zone)
   - Owner action: who controls DNS on decorinterior.ca? If Onder/Metatron, we can add records. If Namecheap/GoDaddy registrar auth, owner provides credentials or adds records directly.

2. **`onder@decorinterior.ca`** (personal — if Onder prefers direct)
   - Same DNS/MX requirement as #1

3. **`hello@decorinterior.ca`** (friendly — common convention)
   - Same DNS/MX requirement as #1

4. **ForwardING `info@decorinterior.ca` → Onder's existing inbox** (lowest-friction)
   - Use ImprovMX or similar free email-forwarding service
   - Only need to add 2 MX records to DNS
   - No separate inbox to manage; mail lands in Onder's current email
   - Metatron sets this up; owner adds DNS records (owner-sovereign per LB-M-2)

**Blocker:** no email identity change applied this cycle because (a) choice is owner-sovereign (LB-M-1 analog on contractor communications) + (b) DNS mutations are owner-only (LB-M-2 contact-graph stewardship on domain boundaries). Current `info@decorcoatings.ca` remains in place until owner authorizes.

**Verification backend status:**
- Resend API key `re_iuH1MLST_...` exists in organism `.env` — can be used for sending FROM decorinterior.ca once DNS verified.
- `src/lib/email-send.ts` handles outbound (lead-form notifications); currently sends from `info@decorcoatings.ca`. Change requires: (1) DNS mutation; (2) Resend domain verify; (3) 1-line edit in `email-send.ts` or `config/site.json`.

---

## 3. MIGRATION_MAP (LB-M-10) — NO path changes this cycle

Per LB-M-10: every rebuild/edit must enumerate URL changes. This cycle has ZERO path changes — only new Header/Footer markup. All 44 enumerated URLs (6 hubs + 15 service pages + 23 city pages) remain at their current paths. Full MIGRATION_MAP = `KEEP_AS_IS` for all URLs.

Verified: `next.config.mjs` has zero redirects/rewrites (unchanged). Git diff shows no file renames or new routes.

The service × city matrix (`/[service]/[city]`) is unchanged; 75 combos remain generated (per build output).

---

## 4. Prod-promote (LB-M-1 analog — owner-sovereign)

Preview deploy: `dpl_CMXcv6ZQ27omsCwC3zQh9vbX1CCM` → https://decorinterior-m4lbzki7d-jimmyjimmyjimmy-svgs-projects.vercel.app (SSO-protected)

To promote to prod (decorinterior.ca):
```bash
vercel promote dpl_CMXcv6ZQ27omsCwC3zQh9vbX1CCM --token $VERCEL_TOKEN --scope jimmyjimmyjimmy-svgs-projects
```

Promote-blockers:
- (a) Items in §1 HIGH are left as-is until owner provides photos OR authorizes imagen regeneration — current images STAY on prod unless prod-promote happens separately.
- (b) Item in §2 is unaddressed — current email STAYS as `info@decorcoatings.ca` on prod.
- (c) Current prod is at `62cb5535bf112437cb6b6a077093420f4da2c01c` (last live production commit per state.json). The preview adds (1) Header mobile burger + dropdowns, (2) Footer Metatron credit — nothing else.

Owner may prod-promote NOW (navigate improvement is independent of image/email issues) OR wait until §1 + §2 are closed. Recommended: prod-promote the nav+footer improvements now; batch §1+§2 into a follow-up cycle.

---

## Citations (F-DRIFT-3)

- F-CT-6 BINDER-INCLUSION — owner is Pareto binder on brand/email/image decisions
- F-CT-7 FUNCTORIALITY — don't pre-lock owner's decision; frame the options
- F-CT-12 SENSORY-GROUND-TRUTH — image-service pairings verified against actual pixel data via vision-LLM
- F-CT-15 OBSERVABLE-NON-DEGENERACY — swap-test is the specific non-degeneracy witness
- LB-M-1 owner-sovereign on prod-promote + outreach
- LB-M-2 contact-graph + domain + credential stewardship
- LB-M-10 MIGRATION_MAP (zero path changes this cycle)
- LB-M-11 Metatron footer credit (applied in Footer.tsx)
- LB-CS-8 LB-CS-15 LB-CS-17 inherited

## Anti-binder (F-DRIFT-5)

**Rejected alternatives:** (a) silently swap in imagen-generated replacement photos for basement-floor-coating + interior-concrete-resurfacing without owner review — violates LB-CS-8 (real work-photos > generative) + LB-M-1 (owner sovereign on contractor-site content); (b) auto-configure DNS records on decorinterior.ca — violates LB-M-2 (domain boundary stewardship); (c) ship with known defects + no owner artifact — violates LB-M-9 adversarial pre-flight ("defects_flagged_to_owner MUST be documented").

**Resurrection condition:** if owner authorizes imagen regeneration for §1 HIGH defects, run shared `visuals-pipeline` with the recommended prompts in-scope. If owner provides DNS access on decorinterior.ca, apply §2 Option 1 (`info@decorinterior.ca` with Resend verification).
