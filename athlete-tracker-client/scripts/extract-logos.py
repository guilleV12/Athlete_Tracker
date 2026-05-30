from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SRC = PUBLIC / (
    "gpt-image-2_Modern_minimalist_logo_for_a_fitness_analytics_SaaS_app_"
    "called_AthleteTracker_._-0.jpg"
)

# Bounds on the 1024x1024 brand sheet (dark logo top, light logo + icons bottom)
BOUNDS = {
    "logo-dark": (40, 24, 980, 300),
    "logo-light": (40, 605, 980, 718),
}

MARK_WIDTH_RATIO = 0.31


def resize_height(im: Image.Image, height: int) -> Image.Image:
    w, h = im.size
    if h == height:
        return im
    new_w = max(1, round(w * (height / h)))
    return im.resize((new_w, height), Image.Resampling.LANCZOS)


def main() -> None:
    sheet = Image.open(SRC).convert("RGB")

    for name, box in BOUNDS.items():
        img = sheet.crop(box)
        img.save(PUBLIC / f"{name}.png", optimize=True)
        print(f"{name}.png", img.size)

    for theme in ("dark", "light"):
        horizontal = Image.open(PUBLIC / f"logo-{theme}.png")
        mark_w = max(1, round(horizontal.width * MARK_WIDTH_RATIO))
        mark = horizontal.crop((0, 0, mark_w, horizontal.height))
        mark.save(PUBLIC / f"logo-mark-{theme}.png", optimize=True)
        print(f"logo-mark-{theme}.png", mark.size)

    icon = resize_height(Image.open(PUBLIC / "logo-mark-dark.png"), 192)
    side = 256
    fav = Image.new("RGBA", (side, side), (19, 17, 28, 255))
    fav.paste(icon.convert("RGBA"), ((side - icon.width) // 2, (side - icon.height) // 2))
    fav.save(PUBLIC / "apple-touch-icon.png", optimize=True)
    print("apple-touch-icon.png", fav.size)

    for stale in ("strip-280.png", "strip-350.png", "strip-600.png", "logo-icon-dark.png", "logo-icon-light.png"):
        path = PUBLIC / stale
        if path.exists():
            path.unlink()


if __name__ == "__main__":
    main()
